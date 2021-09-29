package com.clientsdk;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.json.JSONObject;

import java.util.List;

import io.harness.cfsdk.CfClient;
import io.harness.cfsdk.CfConfiguration;
import io.harness.cfsdk.cloud.core.model.Evaluation;
import io.harness.cfsdk.cloud.events.AuthCallback;
import io.harness.cfsdk.cloud.model.AuthInfo;
import io.harness.cfsdk.cloud.events.AuthResult;
import io.harness.cfsdk.cloud.model.Target;
import io.harness.cfsdk.cloud.oksse.EventsListener;
import io.harness.cfsdk.cloud.oksse.model.StatusEvent;

public class ClientNativeModule extends ReactContextBaseJavaModule {

    public ClientNativeModule(ReactApplicationContext reactContext) {

        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {

        return "ReactNativePlugin";
    }

    private WritableMap evaluationToMap(Evaluation evaluation) {

        WritableMap map = Arguments.createMap();
        map.putString("flag", evaluation.getFlag());

        if (evaluation.getValue() instanceof Boolean) {

            map.putBoolean("value", evaluation.getValue());

        } else if (evaluation.getValue() instanceof Number)

            map.putInt("value", ((Number) evaluation.getValue()).intValue());

        else {

            map.putString("value", evaluation.getValue().toString());
        }
        return map;
    }

    private final EventsListener listener = statusEvent -> {

        System.out.println("On event received: " + statusEvent.getEventType());

        try {
            if (statusEvent.getEventType() == StatusEvent.EVENT_TYPE.EVALUATION_RELOAD) {

                System.out.println("On event received (1)");

                List<Evaluation> list = statusEvent.extractPayload();
                WritableArray array = Arguments.createArray();
                for (Evaluation evaluation : list) {
                    WritableMap map = evaluationToMap(evaluation);
                    array.pushMap(map);
                }
                sendEvent("evaluation_polling", array);

            } else if (statusEvent.getEventType() == StatusEvent.EVENT_TYPE.EVALUATION_CHANGE) {

                System.out.println("On event received (2)");
                Evaluation evaluation = statusEvent.extractPayload();
                WritableMap map = evaluationToMap(evaluation);
                sendEvent("evaluation_change", map);

            } else if (statusEvent.getEventType() == StatusEvent.EVENT_TYPE.SSE_START) {

                System.out.println("On event received (3)");
                sendEvent("start");

            } else if (statusEvent.getEventType() == StatusEvent.EVENT_TYPE.SSE_END) {

                System.out.println("On event received (4)");
                sendEvent("end");
            }
        } catch (IllegalStateException e) {

            Log.e(getClass().getSimpleName(), e.getMessage(), e);
        }
    };

    @ReactMethod
    public void initialize(

            String apiKey,
            ReadableMap configurationMap,
            ReadableMap targetMap,
            Promise callback
    ) {

        System.out.println("Native called init");

        CfConfiguration cfConfiguration = configurationFromMap(configurationMap);
        Target target = targetFromMap(targetMap);

        CfClient.getInstance().initialize(

                getReactApplicationContext(),
                apiKey,
                cfConfiguration,
                target,

                (authInfo, result) -> {

                    if (result.isSuccess()) {

                        if (CfClient.getInstance().registerEventsListener(listener)) {

                            System.out.println("Main React Native events listener has been registered");
                        } else {

                            System.out.println("Main React Native events listener has NOT been registered");
                        }
                    }

                    callback.resolve(result.isSuccess());
                });
    }

    @ReactMethod
    public void stringVariation(String evaluationId, Promise callback) {

        stringVariationWithFallback(evaluationId, null, callback);
    }

    @ReactMethod
    public void stringVariationWithFallback(String evaluationId, String defaultValue, Promise callback) {

        String value = CfClient.getInstance().stringVariation(evaluationId, defaultValue);
        WritableMap map = Arguments.createMap();
        map.putString("flag", evaluationId);
        map.putString("value", value);
        callback.resolve(map);
    }

    @ReactMethod
    public void boolVariation(String evaluationId, Promise callback) {

        boolVariationWithFallback(evaluationId, false, callback);
    }

    @ReactMethod
    public void boolVariationWithFallback(String evaluationId, boolean defaultValue, Promise callback) {

        boolean value = CfClient.getInstance().boolVariation(evaluationId, defaultValue);
        WritableMap map = Arguments.createMap();
        map.putString("flag", evaluationId);
        map.putBoolean("value", value);
        System.out.println("Sending back " + evaluationId + " " + value);
        callback.resolve(map);
    }


    @ReactMethod
    public void numberVariation(String evaluationId, Promise callback) {

        numberVariationWithFallback(evaluationId, null, callback);
    }

    @ReactMethod
    public void numberVariationWithFallback(String evaluationId, Integer defaultValue, Promise callback) {

        double value = CfClient.getInstance().numberVariation(evaluationId, defaultValue);
        WritableMap map = Arguments.createMap();
        map.putString("flag", evaluationId);
        map.putInt("value", (int) value);
        System.out.println("Sending back " + evaluationId + " " + value);
        callback.resolve(map);
    }

    @ReactMethod
    public void jsonVariation(String evaluationId, Promise callback) {

        jsonVariationWithFallback(evaluationId, null, callback);
    }

    @ReactMethod
    public void jsonVariationWithFallback(

            String evaluationId,
            ReadableMap dataMap,
            Promise callback
    ) {

        JSONObject defaultObject = new JSONObject(dataMap.toHashMap());
        JSONObject value = CfClient.getInstance().jsonVariation(evaluationId, defaultObject);
        WritableMap map = Arguments.createMap();
        map.putString("value", value.toString());
        callback.resolve(map);
    }

    @ReactMethod
    public void destroy() {

        CfClient.getInstance().unregisterEventsListener(listener);
        CfClient.getInstance().destroy();
    }

    private CfConfiguration configurationFromMap(ReadableMap configurationMap) {

        CfConfiguration.Builder builder = CfConfiguration.builder();

        if (configurationMap.hasKey("streamEnabled")) {

            boolean enableStream = configurationMap.getBoolean("streamEnabled");
            builder.enableStream(enableStream);
        }

        if (configurationMap.hasKey("analyticsEnabled")) {

            boolean enableAnalytics = configurationMap.getBoolean("analyticsEnabled");
            builder.enableAnalytics(enableAnalytics);
        }

        if (configurationMap.hasKey("baseURL")) {

            String baseUrl = configurationMap.getString("baseURL");
            builder.baseUrl(baseUrl);
        }

        if (configurationMap.hasKey("streamURL")) {

            String streamUrl = configurationMap.getString("streamURL");
            builder.streamUrl(streamUrl);
        }

        if (configurationMap.hasKey("eventURL")) {

            String eventUrl = configurationMap.getString("eventURL");
            builder.eventUrl(eventUrl);
        }

        if (configurationMap.hasKey("pollingInterval")) {

            int pollingInterval = configurationMap.getInt("pollingInterval");
            builder.pollingInterval(pollingInterval);
        }

        return builder.build();
    }

    private Target targetFromMap(ReadableMap targetMap) {

        Target target = new Target();

        if (targetMap.hasKey("name")) {

            String name = targetMap.getString("name");
            target.name(name);
        }

        if (targetMap.hasKey("identifier")) {

            String identifier = targetMap.getString("identifier");
            target.identifier(identifier);
        }

        return target;
    }

    private void sendEvent(final String type) throws IllegalStateException {

        sendEvent(type, null);
    }

    private void sendEvent(

            final String type,
            final Object data

    ) throws IllegalStateException {

        System.out.println("sendEvent(): " + type + ", data: " + data);

        final ReactApplicationContext context = getReactApplicationContext();
        System.out.println("sendEvent(), context: " + context);

        final DeviceEventManagerModule.RCTDeviceEventEmitter module =
                context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);

        if (module == null) {

            throw new IllegalStateException(

                    "No event module available: " +
                            DeviceEventManagerModule.RCTDeviceEventEmitter.class.getSimpleName()
            );
        } else {

            System.out.println("sendEvent(), module.emit");
            module.emit(type, data);
        }
    }
}

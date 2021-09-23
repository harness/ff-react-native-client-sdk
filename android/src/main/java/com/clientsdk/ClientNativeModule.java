package com.clientsdk;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

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
        else map.putString("value", evaluation.getValue().toString());

        return map;
    }

    private EventsListener listener = new EventsListener() {

        @Override
        public void onEventReceived(StatusEvent statusEvent) {

            if (statusEvent.getEventType() == StatusEvent.EVENT_TYPE.EVALUATION_RELOAD) {
                List<Evaluation> list = statusEvent.extractPayload();
                WritableArray array = Arguments.createArray();
                for (Evaluation evaluation : list) {
                    WritableMap map = evaluationToMap(evaluation);
                    array.pushMap(map);
                }
                sendEvent("evaluation_polling", array);
            } else if (statusEvent.getEventType() == StatusEvent.EVENT_TYPE.EVALUATION_CHANGE) {
                Evaluation evaluation = statusEvent.extractPayload();
                WritableMap map = evaluationToMap(evaluation);
                sendEvent("evaluation_change", map);
            } else if (statusEvent.getEventType() == StatusEvent.EVENT_TYPE.SSE_START) {
                sendEvent("start", null);
            } else if (statusEvent.getEventType() == StatusEvent.EVENT_TYPE.SSE_END) {
                sendEvent("end", null);
            }
        }
    };

    private void sendEvent(String type, Object data) {
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(type, data);
    }

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

        if (listener != null) {

            CfClient.getInstance().registerEventsListener(listener);
        }

        CfClient.getInstance().initialize(

                getReactApplicationContext(),
                apiKey,
                cfConfiguration,
                target,

                new AuthCallback() {

                    @Override
                    public void authorizationSuccess(AuthInfo authInfo, AuthResult result) {

                        callback.resolve(result.isSuccess());
                    }
                });
    }

    @ReactMethod
    public void registerEventsListener(Promise callback) {

        // TODO: Support me!
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
    public void jsonVariationWithFallback(String evaluationId, ReadableMap dataMap, Promise callback) {

        JSONObject defaultObject = new JSONObject(dataMap.toHashMap());
        JSONObject value = CfClient.getInstance().jsonVariation(evaluationId, defaultObject);
        WritableMap map = Arguments.createMap();
        map.putString("value", value.toString());
        callback.resolve(map);
    }

    @ReactMethod
    public void destroy() {

        CfClient.getInstance().destroy();
        listener = null;
    }

    private CfConfiguration configurationFromMap(ReadableMap configurationMap) {

        CfConfiguration.Builder builder = CfConfiguration.builder();
        if (configurationMap.hasKey("streamEnabled")) {
            boolean enableStream = configurationMap.getBoolean("streamEnabled");
            builder.enableStream(enableStream);
        }
        if (configurationMap.hasKey("baseUrl")) {
            String baseUrl = configurationMap.getString("baseUrl");
            builder.baseUrl(baseUrl);
        }
        if (configurationMap.hasKey("streamUrl")) {
            String streamUrl = configurationMap.getString("streamUrl");
            builder.streamUrl(streamUrl);
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
}

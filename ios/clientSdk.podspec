Pod::Spec.new do |ff|

  ff.name         = "ff-react-native-client-sdk"
  ff.version      = "0.0.1"
  ff.summary      = "React Native SDK for Harness Feature Flags Management"

  ff.description  = <<-DESC
    Feature Flag Management platform from Harness. React Native SDK can be used to integrate with the platform in your React Native applications.
                   DESC

  ff.homepage     = "https://github.com/drone/ff-react-native-client-sdk"
  ff.license      = { :type => "Apache License, Version 2.0", :file => "LICENSE" }
  ff.author             =  "Harness Inc"

  ff.platform     = :ios, "10.0"
  ff.ios.deployment_target = "10.0"

  ff.source       = { :git => "https://github.com/trajce-bu/ff-react-native-client-sdk.git" }
  s.source_files  = "**/*.{h,m,swift}"

  ff.swift_versions = ['5.0', '5.1', '5.2', '5.3']
  s.dependency "React"
end

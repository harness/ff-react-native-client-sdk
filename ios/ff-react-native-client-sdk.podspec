Pod::Spec.new do |ff|

  ff.name         = "ff-react-native-client-sdk"
  ff.version      = "0.0.1"
  ff.summary      = "React Native SDK for Harness Feature Flags Management"

  ff.description  = <<-DESC
    Feature Flag Management platform from Harness. React Native SDK can be used to integrate with the platform in your React Native applications.
                   DESC

  ff.homepage     = "https://github.com/drone/ff-react-native-client-sdk"
  ff.license      = { :type => "Apache-2.0", :file => "../LICENSE" }
  ff.author       = "Harness Inc"

  ff.platform     = :ios, "10.0"

  ff.source       = { :git => ff.homepage + '.git', :tag: => ff.version }
  ff.source_files  = "**/*.{h,m,swift}"

  ff.swift_version = "5.0"
  ff.dependency "React"
  ff.dependency "ff-ios-client-sdk"
  
end

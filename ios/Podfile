# Uncomment the next line to define a global platform for your project
# platform :ios, '9.0'

target 'RNArenaKit' do
  # Uncomment the next line if you're using Swift or would like to use dynamic frameworks
  # use_frameworks!
  react_native_path="../node_modules/react-native"
  pod "BuddyBuildSDK"
  pod "Yoga", :path => "#{react_native_path}/ReactCommon/yoga" 

  pod 'React', :path => react_native_path, :subspecs => [
  'BatchedBridge', # Required For React Native 0.45.0+
  'Core',
  'ART',
  'RCTActionSheet',
  'RCTAnimation',
  'RCTGeolocation',
  'RCTImage',
  'RCTLinkingIOS',
  'RCTNetwork',
  'RCTSettings',
  'RCTText',
  'RCTVibration',
  'RCTWebSocket',
  'RCTPushNotification',
  'DevSupport'
  # Add any other subspecs you want to use in your project
  ]
  # Pods for RNArenaKit

end

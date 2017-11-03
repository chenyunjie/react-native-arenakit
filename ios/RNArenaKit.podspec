
Pod::Spec.new do |s|
  s.name         = "RNArenaKit"
  s.version      = "1.0.1"
  s.summary      = "RNArenaKit"
  s.description  = <<-DESC
                  RNArenaKit1
                   DESC
  s.homepage     = "https://github.com/chenyunjie/RNArenaKit"
  s.license      = "MIT"
  s.author             = { "陈云杰" => "691432551@qq.com" }
  s.platform     = :ios, "8.0"
  s.source       = { :git => "https://github.com/chenyunjie/RNArenaKit.git", :tag => "master" }
  s.source_files  = "*/*.{h,m}"
  s.requires_arc = true
  s.xcconfig = { "HEADER_SEARCH_PATHS" => [
    "/Users/chenyunjie/workspace/code/git.dev.qianmi.com/react-native-arenakit/ios/Pods/Headers/Public/React"
    ].join(' ')

  }
  #s.dependency "others"

end

  
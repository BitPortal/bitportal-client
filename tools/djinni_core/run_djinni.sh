#! /usr/bin/env bash

### Configuration

# Djinni IDL file location
djinni_file="tools/djinni_core/core.djinni"

# C++ namespace for generated src
namespace="core"

# Objective-C class name prefix for generated src
objc_prefix="BP"

# Java package name for generated src
java_package="com.bitportal.core"


### Script

# get base directory
base_dir=$(cd "`dirname "0"`" && pwd)

# get java directory from package name
java_dir=$(echo $java_package | tr . /)

# output directories for generated src
cpp_out="$base_dir/shared/core/djinni/cpp"
objc_out="$base_dir/shared/core/djinni/objc"
jni_out="$base_dir/shared/core/djinni/jni"
java_out="$base_dir/shared/core/djinni/java/$java_dir"

# clean generated src dirs
rm -rf $cpp_out
rm -rf $jni_out
rm -rf $objc_out
rm -rf $java_out

# execute the djinni command
tools/djinni/src/run \
   --java-out $java_out \
   --java-package $java_package \
   --ident-java-field mFooBar \
   --cpp-out $cpp_out \
   --cpp-namespace $namespace \
   --jni-out $jni_out \
   --ident-jni-class NativeFooBar \
   --ident-jni-file NativeFooBar \
   --objc-out $objc_out \
   --objc-type-prefix $objc_prefix \
   --objcpp-out $objc_out \
   --idl $djinni_file

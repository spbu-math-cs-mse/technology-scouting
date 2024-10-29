@rem
@rem Copyright 2015 the original author or authors.
@rem
@rem Licensed under the Apache License, Version 2.0 (the "License");
@rem you may not use this file except in compliance with the License.
@rem You may obtain a copy of the License at
@rem
@rem      https://www.apache.org/licenses/LICENSE-2.0
@rem
@rem Unless required by applicable law or agreed to in writing, software
@rem distributed under the License is distributed on an "AS IS" BASIS,
@rem WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
@rem See the License for the specific language governing permissions and
@rem limitations under the License.
@rem

@if "%DEBUG%"=="" @echo off
@rem ##########################################################################
@rem
@rem  technology-scouting startup script for Windows
@rem
@rem ##########################################################################

@rem Set local scope for the variables with windows NT shell
if "%OS%"=="Windows_NT" setlocal

set DIRNAME=%~dp0
if "%DIRNAME%"=="" set DIRNAME=.
@rem This is normally unused
set APP_BASE_NAME=%~n0
set APP_HOME=%DIRNAME%..

@rem Resolve any "." and ".." in APP_HOME to make it shorter.
for %%i in ("%APP_HOME%") do set APP_HOME=%%~fi

@rem Add default JVM options here. You can also use JAVA_OPTS and TECHNOLOGY_SCOUTING_OPTS to pass JVM options to this script.
set DEFAULT_JVM_OPTS="-Dio.ktor.development=false"

@rem Find java.exe
if defined JAVA_HOME goto findJavaFromJavaHome

set JAVA_EXE=java.exe
%JAVA_EXE% -version >NUL 2>&1
if %ERRORLEVEL% equ 0 goto execute

echo.
echo ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.
echo.
echo Please set the JAVA_HOME variable in your environment to match the
echo location of your Java installation.

goto fail

:findJavaFromJavaHome
set JAVA_HOME=%JAVA_HOME:"=%
set JAVA_EXE=%JAVA_HOME%/bin/java.exe

if exist "%JAVA_EXE%" goto execute

echo.
echo ERROR: JAVA_HOME is set to an invalid directory: %JAVA_HOME%
echo.
echo Please set the JAVA_HOME variable in your environment to match the
echo location of your Java installation.

goto fail

:execute
@rem Setup the command line

set CLASSPATH=%APP_HOME%\lib\technology-scouting-1.0-SNAPSHOT.jar;%APP_HOME%\lib\dotenv-kotlin-6.4.1.jar;%APP_HOME%\lib\ktor-server-host-common-jvm-3.0.0-rc-1.jar;%APP_HOME%\lib\ktor-server-netty-jvm-3.0.0-rc-1.jar;%APP_HOME%\lib\ktor-server-content-negotiation-jvm-3.0.0-rc-1.jar;%APP_HOME%\lib\ktor-server-swagger-jvm-3.0.0-rc-1.jar;%APP_HOME%\lib\ktor-server-cors-jvm-3.0.0-rc-1.jar;%APP_HOME%\lib\ktor-server-openapi-jvm-3.0.0-rc-1.jar;%APP_HOME%\lib\ktor-server-config-yaml-jvm-3.0.0-rc-1.jar;%APP_HOME%\lib\ktor-server-html-builder-jvm-3.0.0-rc-1.jar;%APP_HOME%\lib\ktor-server-core-jvm-3.0.0-rc-1.jar;%APP_HOME%\lib\ktor-serialization-kotlinx-json-jvm-3.0.0-rc-1.jar;%APP_HOME%\lib\telegram-6.2.0.jar;%APP_HOME%\lib\kotlin-logging-jvm-2.1.21.jar;%APP_HOME%\lib\ktor-serialization-kotlinx-jvm-3.0.0-rc-1.jar;%APP_HOME%\lib\ktor-serialization-jvm-3.0.0-rc-1.jar;%APP_HOME%\lib\ktor-events-jvm-3.0.0-rc-1.jar;%APP_HOME%\lib\ktor-http-cio-jvm-3.0.0-rc-1.jar;%APP_HOME%\lib\ktor-websockets-jvm-3.0.0-rc-1.jar;%APP_HOME%\lib\ktor-http-jvm-3.0.0-rc-1.jar;%APP_HOME%\lib\ktor-network-jvm-3.0.0-rc-1.jar;%APP_HOME%\lib\ktor-utils-jvm-3.0.0-rc-1.jar;%APP_HOME%\lib\yamlkt-jvm-0.13.0.jar;%APP_HOME%\lib\ktor-io-jvm-3.0.0-rc-1.jar;%APP_HOME%\lib\kotlin-stdlib-jdk8-2.0.20.jar;%APP_HOME%\lib\kotlin-reflect-2.0.20.jar;%APP_HOME%\lib\kotlin-stdlib-jdk7-2.0.20.jar;%APP_HOME%\lib\kotlinx-serialization-core-jvm-1.7.2.jar;%APP_HOME%\lib\kotlinx-serialization-json-jvm-1.7.2.jar;%APP_HOME%\lib\kotlinx-html-jvm-0.11.0.jar;%APP_HOME%\lib\kotlinx-io-core-jvm-0.5.3.jar;%APP_HOME%\lib\kotlinx-io-bytestring-jvm-0.5.3.jar;%APP_HOME%\lib\kotlin-stdlib-2.0.20.jar;%APP_HOME%\lib\swagger-codegen-generators-1.0.52.jar;%APP_HOME%\lib\swagger-codegen-3.0.62.jar;%APP_HOME%\lib\logback-classic-1.5.7.jar;%APP_HOME%\lib\kotlinx-coroutines-core-jvm-1.8.1.jar;%APP_HOME%\lib\kotlinx-coroutines-jdk8-1.8.1.jar;%APP_HOME%\lib\mongodb-driver-sync-4.9.0.jar;%APP_HOME%\lib\slf4j-simple-1.7.36.jar;%APP_HOME%\lib\swagger-codegen-2.4.43.jar;%APP_HOME%\lib\slf4j-ext-2.0.9.jar;%APP_HOME%\lib\handlebars-4.3.1.jar;%APP_HOME%\lib\swagger-parser-2.1.22.jar;%APP_HOME%\lib\swagger-parser-v2-converter-2.1.22.jar;%APP_HOME%\lib\swagger-compat-spec-parser-1.0.71.jar;%APP_HOME%\lib\swagger-parser-1.0.71.jar;%APP_HOME%\lib\swagger-core-1.6.14.jar;%APP_HOME%\lib\swagger-parser-v3-2.1.22.jar;%APP_HOME%\lib\swagger-core-2.2.21.jar;%APP_HOME%\lib\swagger-models-1.6.14.jar;%APP_HOME%\lib\slf4j-api-2.0.16.jar;%APP_HOME%\lib\annotations-23.0.0.jar;%APP_HOME%\lib\converter-gson-2.9.0.jar;%APP_HOME%\lib\retrofit-2.9.0.jar;%APP_HOME%\lib\logging-interceptor-3.8.0.jar;%APP_HOME%\lib\swagger-parser-safe-url-resolver-1.0.71.jar;%APP_HOME%\lib\swagger-parser-safe-url-resolver-2.1.22.jar;%APP_HOME%\lib\commons-io-2.16.1.jar;%APP_HOME%\lib\commons-lang3-3.16.0.jar;%APP_HOME%\lib\commons-cli-1.9.0.jar;%APP_HOME%\lib\logback-core-1.5.7.jar;%APP_HOME%\lib\dotenv-java-2.3.2.jar;%APP_HOME%\lib\mongodb-driver-core-4.9.0.jar;%APP_HOME%\lib\bson-record-codec-4.9.0.jar;%APP_HOME%\lib\bson-4.9.0.jar;%APP_HOME%\lib\config-1.4.3.jar;%APP_HOME%\lib\jansi-2.4.1.jar;%APP_HOME%\lib\netty-codec-http2-4.1.113.Final.jar;%APP_HOME%\lib\alpn-api-1.1.3.v20160715.jar;%APP_HOME%\lib\netty-transport-native-kqueue-4.1.113.Final.jar;%APP_HOME%\lib\netty-transport-native-epoll-4.1.113.Final.jar;%APP_HOME%\lib\okhttp-3.14.9.jar;%APP_HOME%\lib\gson-2.8.5.jar;%APP_HOME%\lib\netty-codec-http-4.1.113.Final.jar;%APP_HOME%\lib\netty-handler-4.1.113.Final.jar;%APP_HOME%\lib\netty-codec-4.1.113.Final.jar;%APP_HOME%\lib\netty-transport-classes-kqueue-4.1.113.Final.jar;%APP_HOME%\lib\netty-transport-classes-epoll-4.1.113.Final.jar;%APP_HOME%\lib\netty-transport-native-unix-common-4.1.113.Final.jar;%APP_HOME%\lib\netty-transport-4.1.113.Final.jar;%APP_HOME%\lib\netty-buffer-4.1.113.Final.jar;%APP_HOME%\lib\netty-resolver-4.1.113.Final.jar;%APP_HOME%\lib\netty-common-4.1.113.Final.jar;%APP_HOME%\lib\okio-1.17.2.jar;%APP_HOME%\lib\jmustache-1.16.jar;%APP_HOME%\lib\json-schema-validator-2.2.14.jar;%APP_HOME%\lib\json-schema-core-1.2.14.jar;%APP_HOME%\lib\jackson-coreutils-equivalence-1.0.jar;%APP_HOME%\lib\uri-template-0.10.jar;%APP_HOME%\lib\guava-32.1.3-jre.jar;%APP_HOME%\lib\swagger-parser-core-2.1.22.jar;%APP_HOME%\lib\swagger-models-2.2.21.jar;%APP_HOME%\lib\json-patch-1.13.jar;%APP_HOME%\lib\jackson-coreutils-2.0.jar;%APP_HOME%\lib\jackson-datatype-jsr310-2.17.0.jar;%APP_HOME%\lib\jackson-databind-2.17.0.jar;%APP_HOME%\lib\jackson-annotations-2.17.0.jar;%APP_HOME%\lib\jackson-core-2.17.0.jar;%APP_HOME%\lib\jackson-dataformat-yaml-2.17.0.jar;%APP_HOME%\lib\snakeyaml-2.2.jar;%APP_HOME%\lib\json-20231013.jar;%APP_HOME%\lib\failureaccess-1.0.1.jar;%APP_HOME%\lib\listenablefuture-9999.0-empty-to-avoid-conflict-with-guava.jar;%APP_HOME%\lib\msg-simple-1.2.jar;%APP_HOME%\lib\btf-1.3.jar;%APP_HOME%\lib\jsr305-3.0.2.jar;%APP_HOME%\lib\checker-qual-3.37.0.jar;%APP_HOME%\lib\error_prone_annotations-2.21.1.jar;%APP_HOME%\lib\commonmark-0.17.0.jar;%APP_HOME%\lib\jakarta.xml.bind-api-2.3.3.jar;%APP_HOME%\lib\validation-api-1.1.0.Final.jar;%APP_HOME%\lib\httpclient-4.5.14.jar;%APP_HOME%\lib\swagger-annotations-2.2.21.jar;%APP_HOME%\lib\jakarta.validation-api-2.0.2.jar;%APP_HOME%\lib\byte-buddy-1.14.9.jar;%APP_HOME%\lib\jakarta.activation-api-1.2.2.jar;%APP_HOME%\lib\swagger-annotations-1.6.14.jar;%APP_HOME%\lib\mailapi-1.6.2.jar;%APP_HOME%\lib\joda-time-2.10.5.jar;%APP_HOME%\lib\libphonenumber-8.11.1.jar;%APP_HOME%\lib\jopt-simple-5.0.4.jar;%APP_HOME%\lib\httpcore-4.4.16.jar;%APP_HOME%\lib\commons-logging-1.2.jar;%APP_HOME%\lib\commons-codec-1.11.jar;%APP_HOME%\lib\rhino-1.7.7.2.jar


@rem Execute technology-scouting
"%JAVA_EXE%" %DEFAULT_JVM_OPTS% %JAVA_OPTS% %TECHNOLOGY_SCOUTING_OPTS%  -classpath "%CLASSPATH%" io.ktor.server.netty.EngineMain %*

:end
@rem End local scope for the variables with windows NT shell
if %ERRORLEVEL% equ 0 goto mainEnd

:fail
rem Set variable TECHNOLOGY_SCOUTING_EXIT_CONSOLE if you need the _script_ return code instead of
rem the _cmd.exe /c_ return code!
set EXIT_CODE=%ERRORLEVEL%
if %EXIT_CODE% equ 0 set EXIT_CODE=1
if not ""=="%TECHNOLOGY_SCOUTING_EXIT_CONSOLE%" exit %EXIT_CODE%
exit /b %EXIT_CODE%

:mainEnd
if "%OS%"=="Windows_NT" endlocal

:omega

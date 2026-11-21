@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0Sourcecode\2-Backend" || (echo Folder backend tidak ditemukan. & pause & exit /b 1)

set "JBIN="
if defined JAVA_HOME if exist "%JAVA_HOME%\bin\javac.exe" set "JBIN=%JAVA_HOME%\bin"
if not defined JBIN for /d %%D in ("C:\Program Files\Java\jdk*" "C:\Program Files\Eclipse Adoptium\jdk*" "C:\Program Files\Microsoft\jdk*" "C:\Program Files\Zulu\zulu*" "C:\Program Files\Amazon Corretto\jdk*" "C:\Program Files\BellSoft\LibericaJDK*") do (
    if exist "%%~D\bin\javac.exe" set "JBIN=%%~D\bin"
)
if not defined JBIN (
    echo.
    echo JDK tidak ditemukan di lokasi umum.
    echo Install JDK 17 atau 21 ^(mis. Temurin: adoptium.net^), lalu jalankan ulang.
    echo Atau set JAVA_HOME ke folder JDK Anda.
    pause
    exit /b 1
)
echo Memakai JDK: %JBIN%
"%JBIN%\java.exe" -version
if errorlevel 1 (
    echo java.exe di folder itu gagal dijalankan. Instal ulang JDK.
    pause
    exit /b 1
)

echo.
echo [1/3] Bersihkan hasil kompilasi lama...
if exist target\classes rmdir /s /q target\classes
mkdir target\classes

echo [2/3] Kompilasi semua file Java...
dir /s /b src\main\java\*.java > target\sources.txt
"%JBIN%\javac.exe" -encoding UTF-8 -cp "lib\*" -d target\classes @target\sources.txt
if errorlevel 1 (
    echo KOMPILASI GAGAL. Lihat pesan error di atas.
    pause
    exit /b 1
)

echo [3/3] Menjalankan server di http://localhost:8080 ...
"%JBIN%\java.exe" -cp "target\classes;lib\*" com.ecommerce.ApiServer
echo.
echo Server berhenti (kode keluar: %errorlevel%).
pause

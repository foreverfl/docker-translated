---
title: 다중 단계 빌드
keywords:
  - 개념
  - 빌드
  - 이미지
  - 컨테이너
  - 도커 데스크탑
description: 이 개념 페이지는 다중 단계 빌드의 목적과 그 이점에 대해 가르쳐 줄 것입니다.
weight: 5
aliases:
  - /guides/docker-concepts/building-images/multi-stage-builds/
---

<YoutubeEmbed videoId="vR185cjwxZ8" />

## 설명 {#explanation}

전통적인 빌드에서는 모든 빌드 명령이 순차적으로 실행되며 단일 빌드 컨테이너에서 실행됩니다: 종속성 다운로드, 코드 컴파일, 애플리케이션 패키징. 이러한 모든 레이어는 최종 이미지에 포함됩니다. 이 접근 방식은 작동하지만 불필요한 무게를 지닌 부피가 큰 이미지를 생성하고 보안 위험을 증가시킵니다. 여기서 다중 단계 빌드가 등장합니다.

다중 단계 빌드는 Dockerfile에 여러 단계를 도입하여 각 단계에 특정 목적을 부여합니다. 이는 빌드의 다른 부분을 여러 다른 환경에서 동시에 실행할 수 있는 능력과 같습니다. 빌드 환경을 최종 런타임 환경과 분리함으로써 이미지 크기와 공격 표면을 크게 줄일 수 있습니다. 이는 큰 빌드 종속성을 가진 애플리케이션에 특히 유용합니다.

다중 단계 빌드는 모든 유형의 애플리케이션에 권장됩니다.

- JavaScript, Ruby, Python과 같은 인터프리터 언어의 경우, 하나의 단계에서 코드를 빌드하고 최소화한 다음, 프로덕션 준비 파일을 더 작은 런타임 이미지로 복사할 수 있습니다. 이는 배포를 최적화합니다.
- C, Go, Rust와 같은 컴파일 언어의 경우, 하나의 단계에서 컴파일하고 컴파일된 바이너리를 최종 런타임 이미지로 복사할 수 있습니다. 최종 이미지에 전체 컴파일러를 포함할 필요가 없습니다.

다음은 의사 코드로 작성된 다중 단계 빌드 구조의 간단한 예입니다. 여러 `FROM` 문과 새로운 `AS <stage-name>`이 있습니다. 또한 두 번째 단계의 `COPY` 문은 이전 단계에서 `--from`을 복사하고 있습니다.

```dockerfile
# 단계 1: 빌드 환경
FROM builder-image AS build-stage
# 빌드 도구 설치 (예: Maven, Gradle)
# 소스 코드 복사
# 빌드 명령 (예: 컴파일, 패키징)

# 단계 2: 런타임 환경
FROM runtime-image AS final-stage
# 빌드 단계에서 애플리케이션 아티팩트 복사 (예: JAR 파일)
COPY --from=build-stage /path/in/build/stage /path/to/place/in/final/stage
# 런타임 구성 정의 (예: CMD, ENTRYPOINT)
```

이 Dockerfile은 두 단계를 사용합니다:

- 빌드 단계는 애플리케이션을 컴파일하는 데 필요한 빌드 도구가 포함된 기본 이미지를 사용합니다. 빌드 도구 설치, 소스 코드 복사 및 빌드 명령 실행 명령이 포함됩니다.
- 최종 단계는 애플리케이션을 실행하는 데 적합한 더 작은 기본 이미지를 사용합니다. 빌드 단계에서 컴파일된 아티팩트(JAR 파일 등)를 복사합니다. 마지막으로 애플리케이션을 시작하기 위한 런타임 구성(CMD 또는 ENTRYPOINT 사용)을 정의합니다.

## 시도해보기 {#try-it-out}

이 실습 가이드에서는 다중 단계 빌드의 강력함을 활용하여 샘플 Java 애플리케이션을 위한 간결하고 효율적인 Docker 이미지를 생성할 것입니다. Maven을 사용하여 빌드된 간단한 "Hello World" Spring Boot 기반 애플리케이션을 예제로 사용할 것입니다.

1. [Docker Desktop](https://www.docker.com/products/docker-desktop/)을 다운로드하고 설치합니다.

2. 이 [사전 초기화된 프로젝트](https://start.spring.io/#!type=maven-project&language=java&platformVersion=3.4.0-M3&packaging=jar&jvmVersion=21&groupId=com.example&artifactId=spring-boot-docker&name=spring-boot-docker&description=Demo%20project%20for%20Spring%20Boot&packageName=com.example.spring-boot-docker&dependencies=web)를 열어 ZIP 파일을 생성합니다. 다음과 같이 보입니다:

   ![Spring Initializr 도구의 스크린샷, Java 21, Spring Web 및 Spring Boot 3.4.0 선택됨](images/multi-stage-builds-spring-initializer.webp?border=true)

   [Spring Initializr](https://start.spring.io/)는 Spring 프로젝트를 위한 빠른 시작 생성기입니다. Java, Kotlin, Groovy와 같은 여러 일반 개념에 대한 구현을 통해 JVM 기반 프로젝트를 생성하기 위한 확장 가능한 API를 제공합니다.

   **Generate**를 선택하여 이 프로젝트의 zip 파일을 생성하고 다운로드합니다.

   이 데모에서는 Maven 빌드 자동화와 Java, Spring Web 종속성 및 Java 21을 메타데이터로 사용했습니다.

3. 프로젝트 디렉토리로 이동합니다. 파일을 압축 해제하면 다음과 같은 프로젝트 디렉토리 구조가 나타납니다:

   ```plaintext
   spring-boot-docker
   ├── HELP.md
   ├── mvnw
   ├── mvnw.cmd
   ├── pom.xml
   └── src
       ├── main
       │   ├── java
       │   │   └── com
       │   │       └── example
       │   │           └── spring_boot_docker
       │   │               └── SpringBootDockerApplication.java
       │   └── resources
       │       ├── application.properties
       │       ├── static
       │       └── templates
       └── test
           └── java
               └── com
                   └── example
                       └── spring_boot_docker
                           └── SpringBootDockerApplicationTests.java

   15 directories, 7 files
   ```

   `src/main/java` 디렉토리에는 프로젝트의 소스 코드가 포함되어 있으며, `src/test/java` 디렉토리에는 테스트 소스가 포함되어 있습니다. `pom.xml` 파일은 프로젝트의 프로젝트 객체 모델(POM)입니다.

   `pom.xml` 파일은 Maven 프로젝트의 핵심 구성 요소입니다. 이는 사용자 정의 프로젝트를 빌드하는 데 필요한 대부분의 정보를 포함하는 단일 구성 파일입니다. POM은 방대하고 복잡해 보일 수 있지만, 효과적으로 사용하기 위해 모든 세부 사항을 이해할 필요는 없습니다.

4. "Hello World"를 표시하는 RESTful 웹 서비스를 만듭니다.

   `src/main/java/com/example/spring_boot_docker/` 디렉토리 아래에서 `SpringBootDockerApplication.java` 파일을 다음 내용으로 수정할 수 있습니다:

   ```java
   package com.example.spring_boot_docker;

   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   import org.springframework.web.bind.annotation.RequestMapping;
   import org.springframework.web.bind.annotation.RestController;


   @RestController
   @SpringBootApplication
   public class SpringBootDockerApplication {

       @RequestMapping("/")
           public String home() {
           return "Hello World";
       }

   	public static void main(String[] args) {
   		SpringApplication.run(SpringBootDockerApplication.class, args);
   	}

   }
   ```

   `SpringbootDockerApplication.java` 파일은 `com.example.spring_boot_docker` 패키지를 선언하고 필요한 Spring 프레임워크를 가져오는 것으로 시작합니다. 이 Java 파일은 사용자가 홈페이지를 방문할 때 "Hello World"를 응답하는 간단한 Spring Boot 웹 애플리케이션을 생성합니다.

### Dockerfile 생성 {#create-the-dockerfile}

이제 프로젝트가 준비되었으므로 `Dockerfile`을 생성할 준비가 되었습니다.

1.  `Dockerfile`이라는 파일을 src, pom.xml 등 다른 폴더와 파일이 포함된 동일한 폴더에 생성합니다.

2.  `Dockerfile`에서 다음 줄을 추가하여 기본 이미지를 정의합니다:

    ```dockerfile
    FROM eclipse-temurin:21.0.2_13-jdk-jammy
    ```

3.  `WORKDIR` 명령을 사용하여 작업 디렉토리를 정의합니다. 이는 향후 명령이 실행될 디렉토리와 컨테이너 이미지 내에서 파일이 복사될 디렉토리를 지정합니다.

    ```dockerfile
    WORKDIR /app
    ```

4.  Maven 래퍼 스크립트와 프로젝트의 `pom.xml` 파일을 Docker 컨테이너 내의 현재 작업 디렉토리 `/app`으로 복사합니다.

    ```dockerfile
    COPY .mvn/ .mvn
    COPY mvnw pom.xml ./
    ```

5.  컨테이너 내에서 명령을 실행합니다. 이는 `./mvnw dependency:go-offline` 명령을 실행하여 Maven 래퍼(`./mvnw`)를 사용하여 프로젝트의 모든 종속성을 다운로드하지만 최종 JAR 파일을 빌드하지 않습니다(빠른 빌드를 위해 유용).

    ```dockerfile
    RUN ./mvnw dependency:go-offline
    ```

6.  호스트 머신의 프로젝트에서 `src` 디렉토리를 컨테이너 내의 `/app` 디렉토리로 복사합니다.

    ```dockerfile
    COPY src ./src
    ```

7.  컨테이너가 시작될 때 실행할 기본 명령을 설정합니다. 이 명령은 Maven 래퍼(`./mvnw`)를 `spring-boot:run` 목표와 함께 실행하여 Spring Boot 애플리케이션을 빌드하고 실행하도록 지시합니다.

    ```dockerfile
    CMD ["./mvnw", "spring-boot:run"]
    ```

    이렇게 하면 다음과 같은 Dockerfile이 생성됩니다:

    ```dockerfile
    FROM eclipse-temurin:21.0.2_13-jdk-jammy
    WORKDIR /app
    COPY .mvn/ .mvn
    COPY mvnw pom.xml ./
    RUN ./mvnw dependency:go-offline
    COPY src ./src
    CMD ["./mvnw", "spring-boot:run"]
    ```

### 컨테이너 이미지 빌드 {#build-the-container-image}

1.  다음 명령을 실행하여 Docker 이미지를 빌드합니다:

    ```bash
    $ docker build -t spring-helloworld .
    ```

2.  `docker images` 명령을 사용하여 Docker 이미지의 크기를 확인합니다:

    ```bash
    $ docker images
    ```

    이렇게 하면 다음과 같은 출력이 생성됩니다:

    ```bash
    REPOSITORY          TAG       IMAGE ID       CREATED          SIZE
    spring-helloworld   latest    ff708d5ee194   3 minutes ago    880MB
    ```

    이 출력은 이미지 크기가 880MB임을 보여줍니다. 여기에는 전체 JDK, Maven 도구 체인 등이 포함됩니다. 프로덕션에서는 최종 이미지에 이러한 것이 필요하지 않습니다.

### Spring Boot 애플리케이션 실행 {#run-the-spring-boot-application}

1. 이제 이미지가 빌드되었으므로 컨테이너를 실행할 시간입니다.

   ```bash
   $ docker run -p 8080:8080 spring-helloworld
   ```

   그런 다음 컨테이너 로그에서 다음과 유사한 출력을 볼 수 있습니다:

   ```plaintext
   [INFO] --- spring-boot:3.3.4:run (default-cli) @ spring-boot-docker ---
   [INFO] Attaching agents: []

        .   ____          _            __ _ _
       /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
      ( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
       \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
        '  |____| .__|_| |_|_|_|_\__, | / / / /
       =========|_|==============|___/=/_/_/_/

       :: Spring Boot ::                (v3.3.4)

   2024-09-29T23:54:07.157Z  INFO 159 --- [spring-boot-docker] [           main]
   c.e.s.SpringBootDockerApplication        : Starting SpringBootDockerApplication using Java
   21.0.2 with PID 159 (/app/target/classes started by root in /app)
    ….
   ```

2. 웹 브라우저에서 [http://localhost:8080](http://localhost:8080) 또는 다음 curl 명령을 통해 "Hello World" 페이지에 액세스합니다:

   ```bash
   $ curl localhost:8080
   Hello World
   ```

### 다중 단계 빌드 사용 {#use-multi-stage-builds}

1. 다음 Dockerfile을 고려하십시오:

   ```dockerfile
   FROM eclipse-temurin:21.0.2_13-jdk-jammy AS builder
   WORKDIR /opt/app
   COPY .mvn/ .mvn
   COPY mvnw pom.xml ./
   RUN ./mvnw dependency:go-offline
   COPY ./src ./src
   RUN ./mvnw clean install

   FROM eclipse-temurin:21.0.2_13-jre-jammy AS final
   WORKDIR /opt/app
   EXPOSE 8080
   COPY --from=builder /opt/app/target/*.jar /opt/app/*.jar
   ENTRYPOINT ["java", "-jar", "/opt/app/*.jar"]
   ```

   이 Dockerfile이 두 단계로 나뉘어 있음을 알 수 있습니다.

   - 첫 번째 단계는 이전 Dockerfile과 동일하게 유지되며, 애플리케이션을 빌드하기 위한 Java 개발 키트(JDK) 환경을 제공합니다. 이 단계는 builder라는 이름을 가집니다.

   - 두 번째 단계는 `final`이라는 새로운 단계입니다. 이는 애플리케이션을 실행하는 데 필요한 Java 런타임 환경(JRE)만 포함된 더 슬림한 `eclipse-temurin:21.0.2_13-jre-jammy` 이미지를 사용합니다. 이 이미지는 애플리케이션(JAR 파일)을 실행하는 데 필요한 Java 런타임 환경(JRE)을 제공합니다.

   > 프로덕션 사용을 위해서는 jlink를 사용하여 사용자 정의 JRE와 같은 런타임을 생성하는 것이 강력히 권장됩니다. JRE 이미지는 모든 버전의 Eclipse Temurin에 대해 사용할 수 있지만, `jlink`를 사용하면 애플리케이션에 필요한 Java 모듈만 포함된 최소 런타임을 생성할 수 있습니다. 이는 최종 이미지의 크기를 크게 줄이고 보안을 향상시킬 수 있습니다. 자세한 내용은 [이 페이지](https://hub.docker.com/_/eclipse-temurin)를 참조하십시오.

   다중 단계 빌드를 사용하면 Docker 빌드는 컴파일, 패키징 및 단위 테스트를 위해 하나의 기본 이미지를 사용하고 애플리케이션 런타임을 위해 별도의 이미지를 사용합니다. 결과적으로 최종 이미지는 개발 또는 디버깅 도구를 포함하지 않기 때문에 크기가 작아집니다. 빌드 환경을 최종 런타임 환경과 분리함으로써 이미지 크기를 크게 줄이고 최종 이미지의 보안을 높일 수 있습니다.

2. 이제 이미지를 다시 빌드하고 준비된 프로덕션 빌드를 실행합니다.

   ```bash
   $ docker build -t spring-helloworld-builder .
   ```

   이 명령은 현재 디렉토리에 있는 `Dockerfile` 파일의 최종 단계를 사용하여 `spring-helloworld-builder`라는 Docker 이미지를 빌드합니다.

   :::note
   다중 단계 Dockerfile에서 최종 단계(final)는 기본 빌드 대상입니다. 즉, `docker build` 명령에서 `--target` 플래그를 사용하여 대상 단계를 명시적으로 지정하지 않으면 Docker는 기본적으로 마지막 단계를 빌드합니다. JDK 환경이 있는 빌더 단계를 빌드하려면 `docker build -t spring-helloworld-builder --target builder .`를 사용할 수 있습니다.
   :::

3. `docker images` 명령을 사용하여 이미지 크기 차이를 확인합니다:

   ```bash
   $ docker images
   ```

   다음과 유사한 출력을 얻을 수 있습니다:

   ```bash
   spring-helloworld-builder latest    c5c76cb815c0   24 minutes ago      428MB
   spring-helloworld         latest    ff708d5ee194   About an hour ago   880MB
   ```

   최종 이미지는 원래 빌드 크기인 880MB에 비해 428MB에 불과합니다.

   각 단계를 최적화하고 필요한 것만 포함함으로써 동일한 기능을 유지하면서 전체 이미지 크기를 크게 줄일 수 있었습니다. 이는 성능을 향상시킬 뿐만 아니라 Docker 이미지를 더 가볍고, 더 안전하게 만들며, 관리하기 쉽게 만듭니다.

## 추가 자료 {#additional-resources}

- [다중 단계 빌드](/build/building/multi-stage/)
- [Dockerfile 모범 사례](/develop/develop-images/dockerfile_best-practices/)
- [기본 이미지](/build/building/base-images/)
- [Spring Boot Docker](https://spring.io/guides/topicals/spring-boot-docker)

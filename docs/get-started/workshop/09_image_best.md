---
title: 이미지 빌드 모범 사례
weight: 90
linkTitle: "Part 8: Image-building best practices"
keywords:
  - 시작하기
  - 설정
  - 오리엔테이션
  - 빠른 시작
  - 소개
  - 개념
  - 컨테이너
  - 도커 데스크탑
description: 애플리케이션 이미지를 빌드하기 위한 팁
aliases:
  - /get-started/09_image_best/
  - /guides/workshop/09_image_best/
---

## 이미지 레이어링 {#image-layering}

`docker image history` 명령어를 사용하면 이미지 내 각 레이어를 생성하는 데 사용된 명령어를 볼 수 있습니다.

1. `docker image history` 명령어를 사용하여 생성한 `getting-started` 이미지의 레이어를 확인합니다.

   ```bash
   $ docker image history getting-started
   ```

   다음과 같은 출력이 나와야 합니다.

   ```plaintext
   IMAGE               CREATED             CREATED BY                                      SIZE                COMMENT
   a78a40cbf866        18 seconds ago      /bin/sh -c #(nop)  CMD ["node" "src/index.j…    0B
   f1d1808565d6        19 seconds ago      /bin/sh -c yarn install --production            85.4MB
   a2c054d14948        36 seconds ago      /bin/sh -c #(nop) COPY dir:5dc710ad87c789593…   198kB
   9577ae713121        37 seconds ago      /bin/sh -c #(nop) WORKDIR /app                  0B
   b95baba1cfdb        13 days ago         /bin/sh -c #(nop)  CMD ["node"]                 0B
   <missing>           13 days ago         /bin/sh -c #(nop)  ENTRYPOINT ["docker-entry…   0B
   <missing>           13 days ago         /bin/sh -c #(nop) COPY file:238737301d473041…   116B
   <missing>           13 days ago         /bin/sh -c apk add --no-cache --virtual .bui…   5.35MB
   <missing>           13 days ago         /bin/sh -c #(nop)  ENV YARN_VERSION=1.21.1      0B
   <missing>           13 days ago         /bin/sh -c addgroup -g 1000 node     && addu…   74.3MB
   <missing>           13 days ago         /bin/sh -c #(nop)  ENV NODE_VERSION=12.14.1     0B
   <missing>           13 days ago         /bin/sh -c #(nop)  CMD ["/bin/sh"]              0B
   <missing>           13 days ago         /bin/sh -c #(nop) ADD file:e69d441d729412d24…   5.59MB
   ```

   각 줄은 이미지의 레이어를 나타냅니다. 여기 표시된 내용은 맨 아래에 기본 레이어가 있고 맨 위에 최신 레이어가 있습니다. 이를 사용하여 각 레이어의 크기를 빠르게 확인하고 큰 이미지를 진단할 수 있습니다.

2. 여러 줄이 잘린 것을 알 수 있습니다. `--no-trunc` 플래그를 추가하면 전체 출력을 볼 수 있습니다.

   ```bash
   $ docker image history --no-trunc getting-started
   ```

## 레이어 캐싱 {#layer-caching}

레이어링을 확인했으니, 컨테이너 이미지의 빌드 시간을 줄이는 중요한 교훈을 배울 차례입니다. 한 레이어가 변경되면 모든 하위 레이어도 다시 생성해야 합니다.

다음은 시작 앱을 위해 생성한 Dockerfile입니다.

```dockerfile
# syntax=docker/dockerfile:1
FROM node:lts-alpine
WORKDIR /app
COPY . .
RUN yarn install --production
CMD ["node", "src/index.js"]
```

이미지 히스토리 출력을 다시 보면 Dockerfile의 각 명령어가 이미지의 새로운 레이어가 되는 것을 볼 수 있습니다. 이미지를 변경할 때 yarn 종속성이 다시 설치되어야 했던 것을 기억할 것입니다. 매번 동일한 종속성을 빌드할 때마다 포함하는 것은 별로 의미가 없습니다.

이를 해결하려면 Dockerfile을 재구성하여 종속성 캐싱을 지원해야 합니다. Node 기반 애플리케이션의 경우, 이러한 종속성은 `package.json` 파일에 정의되어 있습니다. 먼저 해당 파일만 복사하여 종속성을 설치한 다음 모든 것을 복사할 수 있습니다. 그러면 `package.json`에 변경 사항이 있을 때만 yarn 종속성을 다시 생성합니다.

1. Dockerfile을 업데이트하여 먼저 `package.json`을 복사하고 종속성을 설치한 다음 모든 것을 복사합니다.

   ```dockerfile
   # syntax=docker/dockerfile:1
   FROM node:lts-alpine
   WORKDIR /app
   COPY package.json yarn.lock ./
   RUN yarn install --production
   COPY . .
   CMD ["node", "src/index.js"]
   ```

2. `docker build`를 사용하여 새 이미지를 빌드합니다.

   ```bash
   $ docker build -t getting-started .
   ```

   다음과 같은 출력이 나와야 합니다.

   ```plaintext
   [+] Building 16.1s (10/10) FINISHED
   => [internal] load build definition from Dockerfile
   => => transferring dockerfile: 175B
   => [internal] load .dockerignore
   => => transferring context: 2B
   => [internal] load metadata for docker.io/library/node:lts-alpine
   => [internal] load build context
   => => transferring context: 53.37MB
   => [1/5] FROM docker.io/library/node:lts-alpine
   => CACHED [2/5] WORKDIR /app
   => [3/5] COPY package.json yarn.lock ./
   => [4/5] RUN yarn install --production
   => [5/5] COPY . .
   => exporting to image
   => => exporting layers
   => => writing image     sha256:d6f819013566c54c50124ed94d5e66c452325327217f4f04399b45f94e37d25
   => => naming to docker.io/library/getting-started
   ```

3. 이제 `src/static/index.html` 파일을 변경합니다. 예를 들어, `<title>`을 "The Awesome Todo App"으로 변경합니다.

4. 다시 `docker build -t getting-started .` 명령어를 사용하여 Docker 이미지를 빌드합니다. 이번에는 출력이 조금 다르게 보일 것입니다.

   ```plaintext
   [+] Building 1.2s (10/10) FINISHED
   => [internal] load build definition from Dockerfile
   => => transferring dockerfile: 37B
   => [internal] load .dockerignore
   => => transferring context: 2B
   => [internal] load metadata for docker.io/library/node:lts-alpine
   => [internal] load build context
   => => transferring context: 450.43kB
   => [1/5] FROM docker.io/library/node:lts-alpine
   => CACHED [2/5] WORKDIR /app
   => CACHED [3/5] COPY package.json yarn.lock ./
   => CACHED [4/5] RUN yarn install --production
   => [5/5] COPY . .
   => exporting to image
   => => exporting layers
   => => writing image     sha256:91790c87bcb096a83c2bd4eb512bc8b134c757cda0bdee4038187f98148e2eda
   => => naming to docker.io/library/getting-started
   ```

   먼저, 빌드가 훨씬 빨라진 것을 알 수 있습니다. 그리고 여러 단계가 이전에 캐시된 레이어를 사용하고 있음을 볼 수 있습니다. 이 이미지를 푸시하고 업데이트하는 것도 훨씬 빨라질 것입니다.

## 멀티 스테이지 빌드 {#multi-stage-builds}

멀티 스테이지 빌드는 여러 스테이지를 사용하여 이미지를 생성하는 데 매우 강력한 도구입니다. 다음과 같은 여러 가지 장점이 있습니다:

- 빌드 타임 종속성을 런타임 종속성과 분리
- 애플리케이션 실행에 필요한 것만 포함하여 전체 이미지 크기 감소

### Maven/Tomcat 예제 {#maven-tomcat-example}

Java 기반 애플리케이션을 빌드할 때, 소스 코드를 Java 바이트코드로 컴파일하기 위해 JDK가 필요합니다. 그러나 해당 JDK는 프로덕션에서는 필요하지 않습니다. 또한, Maven이나 Gradle과 같은 도구를 사용하여 앱을 빌드할 수도 있습니다. 이러한 도구들도 최종 이미지에는 필요하지 않습니다. 멀티 스테이지 빌드가 도움이 됩니다.

```dockerfile
# syntax=docker/dockerfile:1
FROM maven AS build
WORKDIR /app
COPY . .
RUN mvn package

FROM tomcat
COPY --from=build /app/target/file.war /usr/local/tomcat/webapps
```

이 예제에서는 `build`라는 스테이지를 사용하여 Maven을 사용하여 실제 Java 빌드를 수행합니다. 두 번째 스테이지(`FROM tomcat`에서 시작)에서는 `build` 스테이지에서 파일을 복사합니다. 최종 이미지는 마지막 스테이지만 생성되며, `--target` 플래그를 사용하여 재정의할 수 있습니다.

### React 예제 {#react-example}

React 애플리케이션을 빌드할 때, JS 코드(일반적으로 JSX), SASS 스타일시트 등을 정적 HTML, JS, CSS로 컴파일하기 위해 Node 환경이 필요합니다. 서버 사이드 렌더링을 하지 않는다면, 프로덕션 빌드에는 Node 환경이 필요하지 않습니다. 정적 리소스를 정적 nginx 컨테이너에 포함할 수 있습니다.

```dockerfile
# syntax=docker/dockerfile:1
FROM node:lts AS build
WORKDIR /app
COPY package* yarn.lock ./
RUN yarn install
COPY public ./public
COPY src ./src
RUN yarn run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
```

이전 Dockerfile 예제에서는 `node:lts` 이미지를 사용하여 빌드를 수행하고(레이어 캐싱을 최대화) 출력물을 nginx 컨테이너에 복사합니다.

## 요약 {#summary}

이 섹션에서는 레이어 캐싱 및 멀티 스테이지 빌드를 포함한 몇 가지 이미지 빌드 모범 사례를 배웠습니다.

관련 정보:

- [Dockerfile 참조](/reference/dockerfile/)
- [Dockerfile 모범 사례](/manuals/build/building/best-practices.md)

## 다음 단계 {#next-steps}

다음 섹션에서는 컨테이너에 대해 계속 학습할 수 있는 추가 리소스에 대해 알아봅니다.

<Button href="10_what_next.md">다음은 무엇인가요</Button>

---
title: 빌드 캐시 사용
keywords:
  - 개념
  - 빌드
  - 이미지
  - 컨테이너
  - 도커 데스크탑
description: 이 개념 페이지에서는 빌드 캐시에 대해 배우고, 캐시를 무효화하는 변경 사항과 빌드 캐시를 효과적으로 사용하는 방법을 설명합니다.
weight: 4
aliases:
  - /guides/docker-concepts/building-images/using-the-build-cache/
---

<YoutubeEmbed videoId="Ri6jMknjprY" />

## 설명 {#explanation}

[getting-started](./writing-a-dockerfile/) 앱을 위해 작성한 다음 Dockerfile을 고려해보세요.

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN yarn install --production
CMD ["node", "./src/index.js"]
```

`docker build` 명령을 실행하여 새 이미지를 만들 때, Docker는 Dockerfile의 각 명령을 실행하여 각 명령에 대해 레이어를 생성하고 지정된 순서대로 실행합니다. 각 명령에 대해 Docker는 이전 빌드에서 명령을 재사용할 수 있는지 확인합니다. 이전에 유사한 명령을 실행한 적이 있다면, Docker는 이를 다시 실행할 필요가 없습니다. 대신, 캐시된 결과를 사용합니다. 이렇게 하면 빌드 프로세스가 더 빠르고 효율적으로 진행되어 귀중한 시간과 자원을 절약할 수 있습니다.

빌드 캐시를 효과적으로 사용하면 이전 빌드의 결과를 재사용하고 불필요한 작업을 건너뛰어 더 빠른 빌드를 달성할 수 있습니다.
캐시 사용을 최대화하고 리소스 집약적이고 시간이 많이 소요되는 재빌드를 피하려면 캐시 무효화가 어떻게 작동하는지 이해하는 것이 중요합니다.
다음은 캐시를 무효화할 수 있는 몇 가지 상황의 예입니다:

- `RUN` 명령의 명령어 변경은 해당 레이어를 무효화합니다. Docker는 Dockerfile의 `RUN` 명령에 대한 변경 사항을 감지하고 빌드 캐시를 무효화합니다.

- `COPY` 또는 `ADD` 명령으로 이미지에 복사된 파일의 변경 사항. Docker는 프로젝트 디렉토리 내 파일의 변경 사항을 주시합니다. 내용이나 권한과 같은 속성의 변경 여부에 관계없이 Docker는 이러한 변경 사항을 캐시 무효화 트리거로 간주합니다.

- 한 레이어가 무효화되면 모든 후속 레이어도 무효화됩니다. 기본 이미지 또는 중간 레이어를 포함한 이전 레이어가 변경으로 인해 무효화된 경우, Docker는 이를 기반으로 하는 후속 레이어도 무효화하여 빌드 프로세스를 동기화하고 불일치를 방지합니다.

Dockerfile을 작성하거나 편집할 때 불필요한 캐시 미스를 주의하여 빌드가 가능한 한 빠르고 효율적으로 실행되도록 하세요.

## 시도해보기 {#try-it-out}

이 실습 가이드에서는 Node.js 애플리케이션에 대해 Docker 빌드 캐시를 효과적으로 사용하는 방법을 배웁니다.

### 애플리케이션 빌드 {#build-the-application}

1. [Docker Desktop을 다운로드하고 설치](https://www.docker.com/products/docker-desktop/)합니다.

2. 터미널을 열고 [이 샘플 애플리케이션을 클론](https://github.com/dockersamples/todo-list-app)합니다.

   ```bash
   $ git clone https://github.com/dockersamples/todo-list-app
   ```

3. `todo-list-app` 디렉토리로 이동합니다:

   ```bash
   $ cd todo-list-app
   ```

   이 디렉토리 안에는 다음 내용의 `Dockerfile`이라는 파일이 있습니다:

   ```dockerfile
   FROM node:20-alpine
   WORKDIR /app
   COPY . .
   RUN yarn install --production
   EXPOSE 3000
   CMD ["node", "./src/index.js"]
   ```

4. Docker 이미지를 빌드하기 위해 다음 명령을 실행합니다:

   ```bash
   $ docker build .
   ```

   빌드 프로세스의 결과는 다음과 같습니다:

   ```bash
   [+] Building 20.0s (10/10) FINISHED
   ```

   첫 번째 줄은 전체 빌드 프로세스가 _20.0초_ 걸렸음을 나타냅니다. 첫 번째 빌드는 종속성을 설치하기 때문에 시간이 걸릴 수 있습니다.

5. 변경 사항 없이 다시 빌드합니다.

   이제 소스 코드나 Dockerfile에 변경 사항을 가하지 않고 `docker build` 명령을 다시 실행합니다:

   ```bash
   $ docker build .
   ```

   초기 빌드 후의 후속 빌드는 명령과 컨텍스트가 변경되지 않는 한 캐싱 메커니즘 덕분에 더 빠릅니다. Docker는 빌드 프로세스 중 생성된 중간 레이어를 캐시합니다. Dockerfile이나 소스 코드에 변경 사항 없이 이미지를 다시 빌드할 때, Docker는 캐시된 레이어를 재사용하여 빌드 프로세스를 크게 가속화할 수 있습니다.

   ```bash
   [+] Building 1.0s (9/9) FINISHED                                                                            docker:desktop-linux
    => [internal] load build definition from Dockerfile                                                                        0.0s
    => => transferring dockerfile: 187B                                                                                        0.0s
    ...
    => [internal] load build context                                                                                           0.0s
    => => transferring context: 8.16kB                                                                                         0.0s
    => CACHED [2/4] WORKDIR /app                                                                                               0.0s
    => CACHED [3/4] COPY . .                                                                                                   0.0s
    => CACHED [4/4] RUN yarn install --production                                                                              0.0s
    => exporting to image                                                                                                      0.0s
    => => exporting layers                                                                                                     0.0s
    => => exporting manifest
   ```

   후속 빌드는 캐시된 레이어를 활용하여 단 1.0초 만에 완료되었습니다. 종속성 설치와 같은 시간이 많이 소요되는 단계를 반복할 필요가 없습니다.

<div style={{ display: "flex", justifyContent: "center" }}>
<table style={{ textAlign: "center"}}>
  <thead>
    <tr>
      <th>단계</th>
      <th>설명</th>
      <th>소요 시간 (1차 실행)</th>
      <th>소요 시간 (2차 실행)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>Dockerfile에서 빌드 정의 로드</td>
      <td>0.0초</td>
      <td>0.0초</td>
    </tr>
    <tr>
      <td>2</td>
      <td>docker.io/library/node:20-alpine의 메타데이터 로드</td>
      <td>2.7초</td>
      <td>0.9초</td>
    </tr>
    <tr>
      <td>3</td>
      <td>.dockerignore 로드</td>
      <td>0.0초</td>
      <td>0.0초</td>
    </tr>
    <tr>
      <td>4</td>
      <td>빌드 컨텍스트 로드 (컨텍스트 크기: 4.60MB)</td>
      <td>0.1초</td>
      <td>0.0초</td>
    </tr>
    <tr>
      <td>5</td>
      <td>작업 디렉토리 설정 (WORKDIR)</td>
      <td>0.1초</td>
      <td>0.0초</td>
    </tr>
    <tr>
      <td>6</td>
      <td>로컬 코드를 컨테이너로 복사</td>
      <td>0.0초</td>
      <td>0.0초</td>
    </tr>
    <tr>
      <td>7</td>
      <td>yarn install --production 실행</td>
      <td>10.0초</td>
      <td>0.0초</td>
    </tr>
    <tr>
      <td>8</td>
      <td>레이어 내보내기</td>
      <td>2.2초</td>
      <td>0.0초</td>
    </tr>
    <tr>
      <td>9</td>
      <td>최종 이미지 내보내기</td>
      <td>3.0초</td>
      <td>0.0초</td>
    </tr>
  </tbody>
</table>
</div>

`docker image history` 출력으로 돌아가면 Dockerfile의 각 명령이 이미지의 새로운 레이어가 되는 것을 볼 수 있습니다. 이미지를 변경했을 때 `yarn` 종속성을 다시 설치해야 했던 것을 기억할 것입니다. 이를 해결할 방법이 있을까요? 매번 동일한 종속성을 다시 설치하는 것은 의미가 없겠죠?

이를 해결하려면 Dockerfile을 재구성하여 종속성 캐시가 실제로 무효화될 필요가 없는 한 유효하게 유지되도록 합니다. Node 기반 애플리케이션의 경우 종속성은 `package.json` 파일에 정의됩니다. 해당 파일이 변경된 경우 종속성을 다시 설치하고, 파일이 변경되지 않은 경우 캐시된 종속성을 사용합니다. 따라서 먼저 해당 파일만 복사한 다음 종속성을 설치하고, 마지막으로 나머지 모든 파일을 복사합니다. 그러면 `package.json` 파일에 변경 사항이 있는 경우에만 yarn 종속성을 다시 생성하면 됩니다.

6. `package.json` 파일을 먼저 복사하고 종속성을 설치한 다음 나머지 모든 파일을 복사하도록 Dockerfile을 업데이트합니다.

   ```dockerfile
   FROM node:20-alpine
   WORKDIR /app
   COPY package.json yarn.lock ./
   RUN yarn install --production
   COPY . .
   EXPOSE 3000
   CMD ["node", "src/index.js"]
   ```

7. Dockerfile과 동일한 폴더에 `.dockerignore`라는 파일을 다음 내용으로 만듭니다.

   ```plaintext
   node_modules
   ```

8. 새 이미지를 빌드합니다:

   ```bash
   $ docker build .
   ```

   그러면 다음과 유사한 출력을 볼 수 있습니다:

   ```bash
   [+] Building 16.1s (10/10) FINISHED
   => [internal] load build definition from Dockerfile                                               0.0s
   => => transferring dockerfile: 175B                                                               0.0s
   => [internal] load .dockerignore                                                                  0.0s
   => => transferring context: 2B                                                                    0.0s
   => [internal] load metadata for docker.io/library/node:21-alpine                                  0.0s
   => [internal] load build context                                                                  0.8s
   => => transferring context: 53.37MB                                                               0.8s
   => [1/5] FROM docker.io/library/node:21-alpine                                                    0.0s
   => CACHED [2/5] WORKDIR /app                                                                      0.0s
   => [3/5] COPY package.json yarn.lock ./                                                           0.2s
   => [4/5] RUN yarn install --production                                                           14.0s
   => [5/5] COPY . .                                                                                 0.5s
   => exporting to image                                                                             0.6s
   => => exporting layers                                                                            0.6s
   => => writing image
   sha256:d6f819013566c54c50124ed94d5e66c452325327217f4f04399b45f94e37d25        0.0s
   => => naming to docker.io/library/node-app:2.0                                                 0.0s
   ```

   Dockerfile을 꽤 많이 변경했기 때문에 모든 레이어가 다시 빌드되었습니다. 이는 전혀 문제 없습니다.

9. 이제 `src/static/index.html` 파일을 변경합니다 (예: 제목을 "The Awesome Todo App"으로 변경).

10. Docker 이미지를 빌드합니다. 이번에는 출력이 조금 다르게 보일 것입니다.

    ```bash
    $ docker build -t node-app:3.0 .
    ```

    그러면 다음과 유사한 출력을 볼 수 있습니다:

    ```bash
    [+] Building 1.2s (10/10) FINISHED
    => [internal] load build definition from Dockerfile                                               0.0s
    => => transferring dockerfile: 37B                                                                0.0s
    => [internal] load .dockerignore                                                                  0.0s
    => => transferring context: 2B                                                                    0.0s
    => [internal] load metadata for docker.io/library/node:21-alpine                                  0.0s
    => [internal] load build context                                                                  0.2s
    => => transferring context: 450.43kB                                                              0.2s
    => [1/5] FROM docker.io/library/node:21-alpine                                                    0.0s
    => CACHED [2/5] WORKDIR /app                                                                      0.0s
    => CACHED [3/5] COPY package.json yarn.lock ./                                                    0.0s
    => CACHED [4/5] RUN yarn install --production                                                     0.0s
    => [5/5] COPY . .                                                                                 0.5s
    => exporting to image                                                                             0.3s
    => => exporting layers                                                                            0.3s
    => => writing image
    sha256:91790c87bcb096a83c2bd4eb512bc8b134c757cda0bdee4038187f98148e2eda       0.0s
    => => naming to docker.io/library/node-app:3.0                                                 0.0s
    ```

    먼저, 빌드가 훨씬 빨라졌다는 것을 알 수 있습니다. 여러 단계가 이전에 캐시된 레이어를 사용하고 있음을 볼 수 있습니다. 이는 좋은 소식입니다. 빌드 캐시를 사용하고 있습니다. 이 이미지를 푸시하고 업데이트하는 것도 훨씬 빨라질 것입니다.

이러한 최적화 기술을 따르면 Docker 빌드를 더 빠르고 효율적으로 만들어 더 빠른 반복 주기와 향상된 개발 생산성을 얻을 수 있습니다.

## 추가 자료 {#additional-resources}

- [캐시 관리로 빌드 최적화](/build/cache/)
- [캐시 저장소 백엔드](/build/cache/backends/)
- [빌드 캐시 무효화](/build/cache/invalidation/)

## 다음 단계 {#next-steps}

이제 Docker 빌드 캐시를 효과적으로 사용하는 방법을 이해했으므로, 다중 단계 빌드에 대해 배울 준비가 되었습니다.

<Button href="multi-stage-builds">다중 단계 빌드</Button>

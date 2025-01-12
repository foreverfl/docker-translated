---
title: 이미지 빌드, 태그 지정 및 게시
keywords:
  - 개념
  - 빌드
  - 이미지
  - 컨테이너
  - 도커
  - 데스크탑
description: 이 개념 페이지에서는 Docker Hub 또는 다른 레지스트리에 이미지를 빌드, 태그 및 게시하는 방법을 배웁니다.
summary: |
  Building, tagging, and publishing Docker images are key steps in the
  containerization workflow. In this guide, you’ll learn how to create Docker
  images, how to tag those images with a unique identifier, and how to publish
  your image to a public registry.
weight: 3
aliases:
  - /guides/docker-concepts/building-images/build-tag-and-publish-an-image/
---

<YoutubeEmbed videoId="chiiGLlYRlY" />

## 설명 {#explanation}

이 가이드에서는 다음을 배웁니다:

- 이미지 빌드 - `Dockerfile`을 기반으로 이미지를 빌드하는 과정
- 이미지 태그 지정 - 이미지를 이름으로 지정하여 이미지가 배포될 위치를 결정하는 과정
- 이미지 게시 - 새로 생성된 이미지를 컨테이너 레지스트리를 사용하여 배포하거나 공유하는 과정

### 이미지 빌드 {#building-images}

대부분의 경우 이미지는 Dockerfile을 사용하여 빌드됩니다. 가장 기본적인 `docker build` 명령은 다음과 같습니다:

```bash
docker build .
```

명령어의 마지막 `.`은 [빌드 컨텍스트](https://docs.docker.com/build/concepts/context/#what-is-a-build-context)의 경로 또는 URL을 제공합니다. 이 위치에서 빌더는 `Dockerfile` 및 다른 참조 파일을 찾습니다.

빌드를 실행하면 빌더는 필요한 경우 기본 이미지를 가져오고 Dockerfile에 지정된 지침을 실행합니다.

이전 명령어를 사용하면 이미지에 이름이 없지만 출력은 이미지의 ID를 제공합니다. 예를 들어, 이전 명령어는 다음과 같은 출력을 생성할 수 있습니다:

```bash
$ docker build .
[+] Building 3.5s (11/11) FINISHED                                              docker:desktop-linux
 => [internal] load build definition from Dockerfile                                            0.0s
 => => transferring dockerfile: 308B                                                            0.0s
 => [internal] load metadata for docker.io/library/python:3.12                                  0.0s
 => [internal] load .dockerignore                                                               0.0s
 => => transferring context: 2B                                                                 0.0s
 => [1/6] FROM docker.io/library/python:3.12                                                    0.0s
 => [internal] load build context                                                               0.0s
 => => transferring context: 123B                                                               0.0s
 => [2/6] WORKDIR /usr/local/app                                                                0.0s
 => [3/6] RUN useradd app                                                                       0.1s
 => [4/6] COPY ./requirements.txt ./requirements.txt                                            0.0s
 => [5/6] RUN pip install --no-cache-dir --upgrade -r requirements.txt                          3.2s
 => [6/6] COPY ./app ./app                                                                      0.0s
 => exporting to image                                                                          0.1s
 => => exporting layers                                                                         0.1s
 => => writing image sha256:9924dfd9350407b3df01d1a0e1033b1e543523ce7d5d5e2c83a724480ebe8f00    0.0s
```

이전 출력으로, 다음 명령어를 사용하여 참조된 이미지를 사용하여 컨테이너를 시작할 수 있습니다:

```bash
docker run sha256:9924dfd9350407b3df01d1a0e1033b1e543523ce7d5d5e2c83a724480ebe8f00
```

그 이름은 확실히 기억하기 어렵기 때문에 태그 지정이 유용합니다.

### 이미지 태그 지정 {#tagging-images}

이미지 태그 지정은 이미지에 기억하기 쉬운 이름을 제공하는 방법입니다. 그러나 이미지 이름에는 구조가 있습니다. 전체 이미지 이름은 다음과 같은 구조를 가집니다:

```text
[HOST[:PORT_NUMBER]/]PATH[:TAG]
```

- `HOST`: 이미지가 위치한 선택적 레지스트리 호스트 이름입니다. 호스트가 지정되지 않은 경우 기본적으로 Docker의 공개 레지스트리인 `docker.io`가 사용됩니다.
- `PORT_NUMBER`: 호스트 이름이 제공된 경우 레지스트리 포트 번호
- `PATH`: 슬래시로 구분된 구성 요소로 구성된 이미지의 경로입니다. Docker Hub의 경우 형식은 `[NAMESPACE/]REPOSITORY`이며, 네임스페이스는 사용자 또는 조직의 이름입니다. 네임스페이스가 지정되지 않은 경우 `library`가 사용되며, 이는 Docker 공식 이미지의 네임스페이스입니다.
- `TAG`: 일반적으로 이미지의 다른 버전 또는 변형을 식별하는 데 사용되는 사용자 정의, 사람이 읽을 수 있는 식별자입니다. 태그가 지정되지 않은 경우 기본적으로 `latest`가 사용됩니다.

이미지 이름의 예는 다음과 같습니다:

- `nginx`, `docker.io/library/nginx:latest`와 동일: 이는 `docker.io` 레지스트리, `library` 네임스페이스, `nginx` 이미지 리포지토리 및 `latest` 태그에서 이미지를 가져옵니다.
- `docker/welcome-to-docker`, `docker.io/docker/welcome-to-docker:latest`와 동일: 이는 `docker.io` 레지스트리, `docker` 네임스페이스, `welcome-to-docker` 이미지 리포지토리 및 `latest` 태그에서 이미지를 가져옵니다.
- `ghcr.io/dockersamples/example-voting-app-vote:pr-311`: 이는 GitHub 컨테이너 레지스트리, `dockersamples` 네임스페이스, `example-voting-app-vote` 이미지 리포지토리 및 `pr-311` 태그에서 이미지를 가져옵니다.

빌드 중에 이미지를 태그하려면 `-t` 또는 `--tag` 플래그를 추가합니다:

```bash
docker build -t my-username/my-image .
```

이미 이미지를 빌드한 경우 [`docker image tag`](https://docs.docker.com/engine/reference/commandline/image_tag/) 명령을 사용하여 이미지에 다른 태그를 추가할 수 있습니다:

```bash
docker image tag my-username/my-image another-username/another-image:v1
```

### 이미지 게시 {#publishing-images}

이미지를 빌드하고 태그한 후에는 레지스트리에 푸시할 준비가 되었습니다. 이를 위해 [`docker push`](https://docs.docker.com/engine/reference/commandline/image_push/) 명령을 사용합니다:

```bash
docker push my-username/my-image
```

몇 초 내에 이미지의 모든 레이어가 레지스트리에 푸시됩니다.

> **인증 필요**
>
> 이미지를 리포지토리에 푸시하기 전에 인증이 필요합니다.
> 이를 위해 [docker login](https://docs.docker.com/engine/reference/commandline/login/) 명령을 사용합니다.

## 직접 해보기 {#try-it-out}

이 실습 가이드에서는 제공된 Dockerfile을 사용하여 간단한 이미지를 빌드하고 Docker Hub에 푸시합니다.

### 설정 {#set-up}

1.  샘플 애플리케이션을 가져옵니다.

    Git이 있는 경우 샘플 애플리케이션 리포지토리를 클론할 수 있습니다. 그렇지 않으면 샘플 애플리케이션을 다운로드할 수 있습니다. 다음 옵션 중 하나를 선택하십시오.

     <Tabs>
     <TabItem value="clone" label="Git으로 클론">
         터미널에서 다음 명령어를 사용하여 샘플 애플리케이션 리포지토리를 클론합니다.

         ```bash
         git clone https://github.com/docker/getting-started-todo-app
         ```

     </TabItem>

     <TabItem value="download" label="다운로드">
         소스를 다운로드하고 압축을 풉니다.

    <Button href="https://github.com/docker/getting-started-todo-app/raw/cd61f824da7a614a8298db503eed6630eeee33a3/app.zip">소스 다운로드</Button>
    </TabItem>
    </Tabs>

2.  [Docker Desktop을 다운로드하고 설치](https://www.docker.com/products/docker-desktop/)합니다.

3.  Docker 계정이 아직 없는 경우 [지금 만드십시오](https://hub.docker.com/). 완료되면 해당 계정을 사용하여 Docker Desktop에 로그인합니다.

### 이미지 빌드 {#build-an-image}

이제 Docker Hub에 리포지토리가 있으므로 이미지를 빌드하고 리포지토리에 푸시할 차례입니다.

1. 샘플 앱 리포지토리의 루트에서 터미널을 사용하여 다음 명령어를 실행합니다. `YOUR_DOCKER_USERNAME`을 Docker Hub 사용자 이름으로 바꿉니다:

   ```bash
   $ docker build -t <YOUR_DOCKER_USERNAME>/concepts-build-image-demo .
   ```

   예를 들어, 사용자 이름이 `mobywhale`인 경우 다음 명령어를 실행합니다:

   ```bash
   $ docker build -t mobywhale/concepts-build-image-demo .
   ```

2. 빌드가 완료되면 다음 명령어를 사용하여 이미지를 확인할 수 있습니다:

   ```bash
   $ docker image ls
   ```

   명령어는 다음과 유사한 출력을 생성합니다:

   ```plaintext
   REPOSITORY                             TAG       IMAGE ID       CREATED          SIZE
   mobywhale/concepts-build-image-demo    latest    746c7e06537f   24 seconds ago   354MB
   ```

3. [docker image history](/reference/cli/docker/image/history/) 명령어를 사용하여 이미지의 히스토리(또는 이미지가 생성된 방법)를 실제로 확인할 수 있습니다:

   ```bash
   $ docker image history mobywhale/concepts-build-image-demo
   ```

   그런 다음 다음과 유사한 출력을 볼 수 있습니다:

   ```plaintext
   IMAGE          CREATED         CREATED BY                                      SIZE      COMMENT
   f279389d5f01   8 seconds ago   CMD ["node" "./src/index.js"]                   0B        buildkit.dockerfile.v0
   <missing>      8 seconds ago   EXPOSE map[3000/tcp:{}]                         0B        buildkit.dockerfile.v0
   <missing>      8 seconds ago   WORKDIR /app                                    8.19kB    buildkit.dockerfile.v0
   <missing>      4 days ago      /bin/sh -c #(nop)  CMD ["node"]                 0B
   <missing>      4 days ago      /bin/sh -c #(nop)  ENTRYPOINT ["docker-entry…   0B
   <missing>      4 days ago      /bin/sh -c #(nop)  COPY file:4d192565a7220e13…   20.5kB
   <missing>      4 days ago      /bin/sh -c apk add --no-cache --virtual .bui…   7.92MB
   <missing>      4 days ago      /bin/sh -c #(nop)  ENV YARN_VERSION=1.22.19     0B
   <missing>      4 days ago      /bin/sh -c addgroup -g 1000 node     && addu…   126MB
   <missing>      4 days ago      /bin/sh -c #(nop)  ENV NODE_VERSION=20.12.0     0B
   <missing>      2 months ago    /bin/sh -c #(nop)  CMD ["/bin/sh"]              0B
   <missing>      2 months ago    /bin/sh -c #(nop) ADD file:d0764a717d1e9d0af…   8.42MB
   ```

   이 출력은 이미지의 레이어를 보여주며, 추가한 레이어와 기본 이미지에서 상속된 레이어를 강조합니다.

### 이미지 푸시 {#push-the-image}

이미지를 빌드했으므로 이제 이미지를 레지스트리에 푸시할 차례입니다.

1. [docker push](/reference/cli/docker/image/push/) 명령어를 사용하여 이미지를 푸시합니다:

   ```bash
   $ docker push <YOUR_DOCKER_USERNAME>/concepts-build-image-demo
   ```

   `requested access to the resource is denied` 오류가 발생하면 로그인되어 있는지와 Docker 사용자 이름이 이미지 태그에 올바르게 입력되었는지 확인하십시오.

   잠시 후, 이미지가 Docker Hub에 푸시됩니다.

## 추가 자료 {#additional-resources}

이미지 빌드, 태그 지정 및 게시에 대해 자세히 알아보려면 다음 자료를 참조하십시오:

- [빌드 컨텍스트란 무엇입니까?](/build/concepts/context/#what-is-a-build-context)
- [docker build 참조](/engine/reference/commandline/image_build/)
- [docker image tag 참조](/engine/reference/commandline/image_tag/)
- [docker push 참조](/engine/reference/commandline/image_push/)
- [레지스트리란 무엇입니까?](/get-started/docker-concepts/the-basics/what-is-a-registry/)

## 다음 단계 {#next-steps}

이미지 빌드 및 게시에 대해 배웠으므로 Docker 빌드 캐시를 사용하여 빌드 프로세스를 가속화하는 방법을 배울 차례입니다.

<Button href="using-the-build-cache">빌드 캐시 사용</Button>

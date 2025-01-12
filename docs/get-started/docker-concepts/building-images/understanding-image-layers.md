---
title: 이미지 레이어 이해하기
keywords:
  - 개념
  - 빌드
  - 이미지
  - 컨테이너
  - 도커 데스크탑
description: 이 개념 페이지는 컨테이너 이미지의 레이어에 대해 가르쳐 줄 것입니다.
weight: 1
aliases:
  - /guides/docker-concepts/building-images/understanding-image-layers/
---

<YoutubeEmbed videoId="wJwqtAkmtQA" />

## 설명 {#explanation}

[이미지란 무엇인가요?](../the-basics/what-is-an-image/)에서 배운 것처럼, 컨테이너 이미지는 레이어로 구성됩니다. 이 레이어들은 한 번 생성되면 변경할 수 없습니다. 하지만, 이것이 실제로 무엇을 의미할까요? 그리고 이러한 레이어들은 컨테이너가 사용할 수 있는 파일 시스템을 어떻게 생성할까요?

### 이미지 레이어 {#image-layers}

이미지의 각 레이어는 파일 시스템 변경 사항(추가, 삭제 또는 수정)을 포함합니다. 이론적인 이미지를 살펴보겠습니다:

1. 첫 번째 레이어는 기본 명령어와 apt 같은 패키지 관리자를 추가합니다.
2. 두 번째 레이어는 Python 런타임과 의존성 관리를 위한 pip를 설치합니다.
3. 세 번째 레이어는 애플리케이션의 특정 requirements.txt 파일을 복사합니다.
4. 네 번째 레이어는 애플리케이션의 특정 의존성을 설치합니다.
5. 다섯 번째 레이어는 실제 애플리케이션 소스 코드를 복사합니다.

이 예시는 다음과 같습니다:

![이미지 레이어 개념을 보여주는 플로우차트 스크린샷](images/container_image_layers.webp?border=true)

이것은 레이어를 이미지 간에 재사용할 수 있게 해주기 때문에 유용합니다. 예를 들어, 다른 Python 애플리케이션을 만들고 싶다고 상상해보세요. 레이어링 덕분에 동일한 Python 베이스를 활용할 수 있습니다. 이는 빌드를 더 빠르게 하고 이미지를 배포하는 데 필요한 저장 공간과 대역폭을 줄여줍니다. 이미지 레이어링은 다음과 유사하게 보일 수 있습니다:

![이미지 레이어링의 이점을 보여주는 플로우차트 스크린샷](images/container_image_layer_reuse.webp?border=true)

레이어를 사용하면 다른 사람의 이미지를 확장하여 베이스 레이어를 재사용하고 애플리케이션에 필요한 데이터만 추가할 수 있습니다.

### 레이어 쌓기 {#stacking-the-layers}

레이어링은 콘텐츠 주소 지정 저장소(content-addressable storage)와 유니온 파일 시스템(union file system) 덕분에 가능합니다. 조금 기술적인 내용이지만, 작동 방식은 다음과 같습니다.:

1. 각 레이어가 다운로드된 후, 호스트 파일 시스템의 자체 디렉토리에 추출됩니다.
2. 이미지를 사용하여 컨테이너를 실행할 때, 레이어가 서로 위에 쌓여 새로운 통합 뷰를 생성하는 유니온 파일 시스템이 생성됩니다.
3. 컨테이너가 시작되면, 루트 디렉토리는 `chroot`를 사용하여 이 통합 디렉토리의 위치로 설정됩니다.

유니온 파일 시스템이 생성될 때, 이미지 레이어 외에도 실행 중인 컨테이너를 위한 디렉토리가 생성됩니다. 이는 컨테이너가 파일 시스템 변경을 할 수 있게 하면서 원래 이미지 레이어는 그대로 유지되도록 합니다. 이를 통해 동일한 기본 이미지를 사용하여 여러 컨테이너를 실행할 수 있습니다.

## 직접 해보기 {#try-it-out}

이 실습 가이드에서는 [`docker container commit`](https://docs.docker.com/reference/cli/docker/container/commit/) 명령을 사용하여 수동으로 새로운 이미지 레이어를 생성할 것입니다. 일반적으로는 [Dockerfile을 사용](./writing-a-dockerfile.md)하지만, 이렇게 하면 작동 방식을 더 쉽게 이해할 수 있습니다.

### 베이스 이미지 생성 {#create-a-base-image}

첫 번째 단계에서는 이후 단계에서 사용할 베이스 이미지를 생성합니다.

1. [Docker Desktop 다운로드 및 설치](https://www.docker.com/products/docker-desktop).

2. 터미널에서 다음 명령을 실행하여 새 컨테이너를 시작합니다:

   ```bash
   $ docker run --name=base-container -ti ubuntu
   ```

   이미지가 다운로드되고 컨테이너가 시작되면 새 셸 프롬프트가 표시됩니다. 이는 컨테이너 내부에서 실행되고 있습니다. 다음과 유사하게 보일 것입니다(컨테이너 ID는 다를 수 있습니다):

   ```bash
   root@d8c5ca119fcd:/#
   ```

3. 컨테이너 내부에서 다음 명령을 실행하여 Node.js를 설치합니다:

   ```bash
   $ apt update && apt install -y nodejs
   ```

   이 명령이 실행되면 Node가 컨테이너 내부에 다운로드 및 설치됩니다. 유니온 파일 시스템의 맥락에서, 이러한 파일 시스템 변경은 이 컨테이너에 고유한 디렉토리 내에서 발생합니다.

4. 다음 명령을 실행하여 Node가 설치되었는지 확인합니다:

   ```bash
   $ node -e 'console.log("Hello world!")'
   ```

   그러면 콘솔에 "Hello world!"가 표시됩니다.

5. 이제 Node가 설치되었으므로, 변경 사항을 새로운 이미지 레이어로 저장할 준비가 되었습니다. 이를 통해 새 컨테이너를 시작하거나 새 이미지를 빌드할 수 있습니다. 이를 위해 [`docker container commit`](https://docs.docker.com/reference/cli/docker/container/commit/) 명령을 사용합니다. 새 터미널에서 다음 명령을 실행합니다:

   ```bash
   $ docker container commit -m "Add node" base-container node-base
   ```

6. `docker image history` 명령을 사용하여 이미지의 레이어를 확인합니다:

   ```bash
   $ docker image history node-base
   ```

   다음과 유사한 출력이 표시됩니다:

   ```bash
   IMAGE          CREATED          CREATED BY                                      SIZE      COMMENT
   d5c1fca2cdc4   10 seconds ago   /bin/bash                                       126MB     Add node
   2b7cc08dcdbb   5 weeks ago      /bin/sh -c #(nop)  CMD ["/bin/bash"]            0B
   <missing>      5 weeks ago      /bin/sh -c #(nop) ADD file:07cdbabf782942af0…   69.2MB
   <missing>      5 weeks ago      /bin/sh -c #(nop)  LABEL org.opencontainers.…   0B
   <missing>      5 weeks ago      /bin/sh -c #(nop)  LABEL org.opencontainers.…   0B
   <missing>      5 weeks ago      /bin/sh -c #(nop)  ARG LAUNCHPAD_BUILD_ARCH     0B
   <missing>      5 weeks ago      /bin/sh -c #(nop)  ARG RELEASE                  0B
   ```

   상단 줄의 "Add node" 주석을 주목하세요. 이 레이어는 방금 설치한 Node.js를 포함합니다.

7. 이미지에 Node가 설치되었음을 증명하기 위해, 이 새로운 이미지를 사용하여 새 컨테이너를 시작할 수 있습니다:

   ```bash
   $ docker run node-base node -e "console.log('Hello again')"
   ```

   그러면 터미널에 "Hello again" 출력이 표시되어 Node가 설치되고 작동 중임을 보여줍니다.

8. 베이스 이미지 생성을 완료했으므로 해당 컨테이너를 제거할 수 있습니다:

   ```bash
   $ docker rm -f base-container
   ```

> **베이스 이미지 정의**
>
> 베이스 이미지는 다른 이미지를 빌드하기 위한 기초입니다. 어떤 이미지를 베이스 이미지로 사용할 수 있습니다. 그러나 일부 이미지는 의도적으로 빌딩 블록으로 생성되어 애플리케이션의 기초 또는 시작점을 제공합니다.
>
> 이 예제에서는 이 `node-base` 이미지를 실제로 배포하지 않을 것입니다. 아직 아무것도 하지 않기 때문입니다. 그러나 다른 빌드를 위해 사용할 수 있는 베이스입니다.

### 앱 이미지 빌드 {#build-an-app-image}

이제 베이스 이미지가 있으므로, 해당 이미지를 확장하여 추가 이미지를 빌드할 수 있습니다.

1. 새로 생성된 node-base 이미지를 사용하여 새 컨테이너를 시작합니다:

   ```bash
   $ docker run --name=app-container -ti node-base
   ```

2. 이 컨테이너 내부에서 다음 명령을 실행하여 Node 프로그램을 생성합니다:

   ```bash
   $ echo 'console.log("Hello from an app")' > app.js
   ```

   이 Node 프로그램을 실행하려면 다음 명령을 사용하여 화면에 메시지를 표시할 수 있습니다:

   ```bash
   $ node app.js
   ```

3. 다른 터미널에서 다음 명령을 실행하여 이 컨테이너의 변경 사항을 새 이미지로 저장합니다:

   ```bash
   $ docker container commit -c "CMD node app.js" -m "Add app" app-container sample-app
   ```

   이 명령은 `sample-app`이라는 새 이미지를 생성할 뿐만 아니라, 컨테이너를 시작할 때 기본 명령을 설정하는 추가 구성을 이미지에 추가합니다. 이 경우, `node app.js`를 자동으로 실행하도록 설정합니다.

4. 컨테이너 외부의 터미널에서 다음 명령을 실행하여 업데이트된 레이어를 확인합니다:

   ```bash
   $ docker image history sample-app
   ```

   그러면 다음과 같은 출력이 표시됩니다. 상단 레이어 주석에 "Add app"이 있고, 다음 레이어에 "Add node"가 있습니다:

   ```bash
   IMAGE          CREATED              CREATED BY                                      SIZE      COMMENT
   c1502e2ec875   About a minute ago   /bin/bash                                       33B       Add app
   5310da79c50a   4 minutes ago        /bin/bash                                       126MB     Add node
   2b7cc08dcdbb   5 weeks ago          /bin/sh -c #(nop)  CMD ["/bin/bash"]            0B
   <missing>      5 weeks ago          /bin/sh -c #(nop) ADD file:07cdbabf782942af0…   69.2MB
   <missing>      5 weeks ago          /bin/sh -c #(nop)  LABEL org.opencontainers.…   0B
   <missing>      5 weeks ago          /bin/sh -c #(nop)  LABEL org.opencontainers.…   0B
   <missing>      5 weeks ago          /bin/sh -c #(nop)  ARG LAUNCHPAD_BUILD_ARCH     0B
   <missing>      5 weeks ago          /bin/sh -c #(nop)  ARG RELEASE                  0B
   ```

5. 마지막으로, 새 이미지를 사용하여 새 컨테이너를 시작합니다. 기본 명령을 지정했으므로 다음 명령을 사용할 수 있습니다:

   ```bash
   $ docker run sample-app
   ```

   Node 프로그램에서 나오는 인사말이 터미널에 표시됩니다.

6. 컨테이너 작업을 완료했으므로 다음 명령을 사용하여 컨테이너를 제거할 수 있습니다:

   ```bash
   $ docker rm -f app-container
   ```

## 추가 자료 {#additional-resources}

배운 내용을 더 깊이 탐구하고 싶다면 다음 자료를 확인하세요:

- [`docker image history`](/reference/cli/docker/image/history/)
- [`docker container commit`](/reference/cli/docker/container/commit/)

## 다음 단계 {#next-steps}

앞서 언급했듯이, 대부분의 이미지 빌드는 `docker container commit`을 사용하지 않습니다. 대신, 이러한 단계를 자동화하는 Dockerfile을 사용합니다.

<Button href="writing-a-dockerfile">Dockerfile 작성하기</Button>

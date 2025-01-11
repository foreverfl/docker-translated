---
title: 이미지란 무엇인가요?
weight: 20
keywords:
  - 개념
  - 빌드
  - 이미지
  - 컨테이너
  - 도커 데스크탑
description: 이미지란 무엇인가
aliases:
  - /guides/docker-concepts/the-basics/what-is-an-image/
  - /get-started/run-docker-hub-images/
---

<YoutubeEmbed videoId="NyvT9REqLe4" />

## 설명 {#explanation}

[컨테이너](./what-is-a-container.md)가 격리된 프로세스라면, 파일과 설정은 어디에서 가져오나요? 이러한 환경을 어떻게 공유하나요?

그것이 바로 컨테이너 이미지입니다. 컨테이너 이미지는 컨테이너를 실행하는 데 필요한 모든 파일, 바이너리, 라이브러리 및 설정을 포함하는 표준화된 패키지입니다.

[PostgreSQL](https://hub.docker.com/_/postgres) 이미지의 경우, 해당 이미지는 데이터베이스 바이너리, 구성 파일 및 기타 종속성을 패키징합니다. Python 웹 앱의 경우, Python 런타임, 앱 코드 및 모든 종속성을 포함합니다.

이미지의 두 가지 중요한 원칙이 있습니다:

1. 이미지는 불변입니다. 이미지가 생성되면 수정할 수 없습니다. 새로운 이미지를 만들거나 변경 사항을 추가할 수만 있습니다.

2. 컨테이너 이미지는 레이어로 구성됩니다. 각 레이어는 파일 시스템 변경 사항을 추가, 제거 또는 수정하는 파일 시스템 변경 집합을 나타냅니다.

이 두 가지 원칙은 기존 이미지를 확장하거나 추가할 수 있게 합니다. 예를 들어, Python 앱을 빌드하는 경우, [Python 이미지](https://hub.docker.com/_/python)에서 시작하여 앱의 종속성을 설치하고 코드를 추가하는 추가 레이어를 추가할 수 있습니다. 이를 통해 Python 자체보다는 앱에 집중할 수 있습니다.

### 이미지 찾기 {#finding-images}

[Docker Hub](https://hub.docker.com)는 이미지를 저장하고 배포하는 기본 글로벌 마켓플레이스입니다. 개발자가 만든 100,000개 이상의 이미지를 로컬에서 실행할 수 있습니다. Docker Hub 이미지를 검색하고 Docker Desktop에서 직접 실행할 수 있습니다.

Docker Hub는 Docker가 지원하고 승인한 다양한 이미지를 제공합니다. 이러한 이미지는 완전히 관리되는 서비스 또는 자체 이미지의 훌륭한 시작점을 제공합니다. 여기에는 다음이 포함됩니다:

- [Docker 공식 이미지](https://hub.docker.com/search?q=&type=image&image_filter=official): Docker에서 엄선한 저장소 모음으로, 대부분의 사용자들이 처음 시작할 때 사용하며 Docker Hub에서 가장 안전한 이미지들입니다.
- [Docker 검증된 게시자](https://hub.docker.com/search?q=&image_filter=store): Docker가 인증한 기업들이 제공하는 고품질 이미지입니다.
- [Docker 후원 오픈 소스](https://hub.docker.com/search?q=&image_filter=open_source): Docker의 오픈소스 프로그램을 통해 지원받는 오픈소스 프로젝트에서 제공하고 관리하는 이미지입니다.

예를 들어, [Redis](https://hub.docker.com/_/redis) 및 [Memcached](https://hub.docker.com/_/memcached)는 인기 있는 Docker 공식 이미지 중 일부입니다. 이러한 이미지를 다운로드하여 몇 초 만에 이러한 서비스를 실행할 수 있습니다. 또한 [Node.js](https://hub.docker.com/_/node) Docker 이미지와 같은 기본 이미지도 있으며, 이를 시작점으로 사용하여 자체 파일 및 구성을 추가할 수 있습니다.

## 시도해보기 {#try-it-out}

<Tabs>
<TabItem value="gui" label="GUI 사용">

이 실습에서는 Docker Desktop GUI를 사용하여 컨테이너 이미지를 검색하고 가져오는 방법을 배웁니다.

### 이미지 검색 및 다운로드 {#search-for-and-download-an-image}

1. Docker Desktop 대시보드를 열고 왼쪽 탐색 메뉴에서 **Images** 보기를 선택합니다.

   ![Docker Desktop 대시보드의 왼쪽 사이드바에 이미지 보기를 보여주는 스크린샷](images/click-image.webp?border=true&w=1050&h=400)

2. **Search images to run** 버튼을 선택합니다. 보이지 않으면 화면 상단의 *글로벌 검색 바*를 선택합니다.

   ![Docker Desktop 대시보드에서 검색 탭을 보여주는 스크린샷](images/search-image.webp?border)

3. **Search** 필드에 "welcome-to-docker"를 입력합니다. 검색이 완료되면 `docker/welcome-to-docker` 이미지를 선택합니다.

   ![docker/welcome-to-docker 이미지를 검색한 결과를 보여주는 Docker Desktop 대시보드의 스크린샷](images/select-image.webp?border=true&w=1050&h=400)

4. 이미지를 다운로드하려면 **Pull**을 선택합니다.

### 이미지에 대해 알아보기 {#learn-about-the-image}

이미지를 다운로드한 후에는 GUI 또는 CLI를 통해 이미지에 대한 여러 세부 정보를 확인할 수 있습니다.

1. Docker Desktop 대시보드에서 **Images** 보기를 선택합니다.

2. **docker/welcome-to-docker** 이미지를 선택하여 이미지에 대한 세부 정보를 엽니다.

   ![docker/welcome-to-docker 이미지를 가리키는 화살표와 함께 이미지 보기를 보여주는 Docker Desktop 대시보드의 스크린샷](images/pulled-image.webp?border=true&w=1050&h=400)

3. 이미지 세부 정보 페이지에서는 이미지의 레이어, 이미지에 설치된 패키지 및 라이브러리, 발견된 취약성에 대한 정보를 제공합니다.

   ![docker/welcome-to-docker 이미지의 이미지 레이어 보기를 보여주는 스크린샷](images/image-layers.webp?border=true&w=1050&h=400)

</TabItem>

<TabItem value="cli" label="CLI 사용">

CLI를 사용하여 Docker 이미지를 검색하고 가져와서 레이어를 확인하는 방법을 따르세요.

### 이미지 검색 및 다운로드 {#search-for-and-download-an-image}

1. 터미널을 열고 [`docker search`](/reference/cli/docker/search.md) 명령을 사용하여 이미지를 검색합니다:

   ```bash
   docker search docker/welcome-to-docker
   ```

   다음과 같은 출력이 표시됩니다:

   ```bash
   NAME                       DESCRIPTION                                     STARS     OFFICIAL
   docker/welcome-to-docker   Docker image for new users getting started w…   20
   ```

   이 출력은 Docker Hub에서 사용할 수 있는 관련 이미지에 대한 정보를 보여줍니다.

2. [`docker pull`](/reference/cli/docker/image/pull.md) 명령을 사용하여 이미지를 가져옵니다.

   ```bash
   docker pull docker/welcome-to-docker
   ```

   다음과 같은 출력이 표시됩니다:

   ```bash
   Using default tag: latest
   latest: Pulling from docker/welcome-to-docker
   579b34f0a95b: Download complete
   d11a451e6399: Download complete
   1c2214f9937c: Download complete
   b42a2f288f4d: Download complete
   54b19e12c655: Download complete
   1fb28e078240: Download complete
   94be7e780731: Download complete
   89578ce72c35: Download complete
   Digest: sha256:eedaff45e3c78538087bdd9dc7afafac7e110061bbdd836af4104b10f10ab693
   Status: Downloaded newer image for docker/welcome-to-docker:latest
   docker.io/docker/welcome-to-docker:latest
   ```

   각 줄은 이미지의 다른 다운로드된 레이어를 나타냅니다. 각 레이어는 파일 시스템 변경 집합이며 이미지의 기능을 제공합니다.

### 이미지에 대해 알아보기 {#learn-about-the-image}

1. [`docker image ls`](/reference/cli/docker/image/ls.md) 명령을 사용하여 다운로드한 이미지를 나열합니다:

   ```bash
   docker image ls
   ```

   다음과 같은 출력이 표시됩니다:

   ```bash
   REPOSITORY                 TAG       IMAGE ID       CREATED        SIZE
   docker/welcome-to-docker   latest    eedaff45e3c7   4 months ago   29.7MB
   ```

   이 명령은 현재 시스템에 있는 Docker 이미지 목록을 보여줍니다. `docker/welcome-to-docker`의 총 크기는 약 29.7MB입니다.

   > **이미지 크기**
   >
   > 여기서 표시된 이미지 크기는 이미지의 압축 해제된 크기를 나타내며, 레이어의 다운로드 크기는 아닙니다.

2. [`docker image history`](/reference/cli/docker/image/history.md) 명령을 사용하여 이미지의 레이어를 나열합니다:

   ```bash
   docker image history docker/welcome-to-docker
   ```

   다음과 같은 출력이 표시됩니다:

   ```bash
   IMAGE          CREATED        CREATED BY                                      SIZE      COMMENT
   648f93a1ba7d   4 months ago   COPY /app/build /usr/share/nginx/html # buil…   1.6MB     buildkit.dockerfile.v0
   <missing>      5 months ago   /bin/sh -c #(nop)  CMD ["nginx" "-g" "daemon…   0B
   <missing>      5 months ago   /bin/sh -c #(nop)  STOPSIGNAL SIGQUIT           0B
   <missing>      5 months ago   /bin/sh -c #(nop)  EXPOSE 80                    0B
   <missing>      5 months ago   /bin/sh -c #(nop)  ENTRYPOINT ["/docker-entr…   0B
   <missing>      5 months ago   /bin/sh -c #(nop) COPY file:9e3b2b63db9f8fc7…   4.62kB
   <missing>      5 months ago   /bin/sh -c #(nop) COPY file:57846632accc8975…   3.02kB
   <missing>      5 months ago   /bin/sh -c #(nop) COPY file:3b1b9915b7dd898a…   298B
   <missing>      5 months ago   /bin/sh -c #(nop) COPY file:caec368f5a54f70a…   2.12kB
   <missing>      5 months ago   /bin/sh -c #(nop) COPY file:01e75c6dd0ce317d…   1.62kB
   <missing>      5 months ago   /bin/sh -c set -x     && addgroup -g 101 -S …   9.7MB
   <missing>      5 months ago   /bin/sh -c #(nop)  ENV PKG_RELEASE=1            0B
   <missing>      5 months ago   /bin/sh -c #(nop)  ENV NGINX_VERSION=1.25.3     0B
   <missing>      5 months ago   /bin/sh -c #(nop)  LABEL maintainer=NGINX Do…   0B
   <missing>      5 months ago   /bin/sh -c #(nop)  CMD ["/bin/sh"]              0B
   <missing>      5 months ago   /bin/sh -c #(nop) ADD file:ff3112828967e8004…   7.66MB
   ```

   이 출력은 모든 레이어, 크기 및 레이어를 생성하는 데 사용된 명령을 보여줍니다.

   > **전체 명령 보기**
   >
   > `--no-trunc` 플래그를 명령에 추가하면 전체 명령을 볼 수 있습니다. 출력이 테이블 형식이므로, 더 긴 명령은 탐색하기 어려울 수 있습니다.

</TabItem>
</Tabs>

이번 학습에서는 Docker 이미지를 검색하고 가져왔습니다. Docker 이미지를 가져오는 것 외에도 Docker 이미지의 레이어에 대해 배웠습니다.

## 추가 자료 {#additional-resources}

다음 자료는 이미지 탐색, 찾기 및 빌드에 대해 더 배우는 데 도움이 됩니다:

- [Docker 신뢰할 수 있는 콘텐츠](/manuals/docker-hub/image-library/trusted-content.md)
- [Docker Desktop에서 이미지 보기 탐색](/manuals/desktop/use-desktop/images.md)
- [Docker 빌드 개요](/manuals/build/concepts/overview.md)
- [Docker Hub](https://hub.docker.com)

## 다음 단계 {#next-steps}

이미지의 기본 사항을 배웠으므로, 레지스트리를 통해 이미지를 배포하는 방법을 배울 차례입니다.

<Button href="what-is-a-registry">레지스트리란 무엇인가?</Button>

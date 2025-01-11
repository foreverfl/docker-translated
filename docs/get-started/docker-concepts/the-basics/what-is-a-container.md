---
title: 컨테이너란 무엇인가?
weight: 10
keywords:
  - 개념
  - 빌드
  - 이미지
  - 컨테이너
  - 도커 데스크탑
description: 컨테이너란 무엇인가? 이 개념 페이지는 컨테이너에 대해 가르치고 첫 번째 컨테이너를 실행하는 빠른 실습을 제공합니다.
aliases:
  - /guides/walkthroughs/what-is-a-container/
  - /guides/walkthroughs/run-a-container/
  - /guides/walkthroughs/
  - /get-started/run-your-own-container/
  - /guides/docker-concepts/the-basics/what-is-a-container/
---

<YoutubeEmbed videoId="W1kWqFkiu7k" />

## 설명 {#explanation}

React 프론트엔드와 Python API, PostgreSQL 데이터베이스로 구성된 멋진 웹 애플리케이션을 개발한다고 가정해보세요. 이 프로젝트를 작업하기 위해서는 Node와 Python, PostgreSQL을 설치해야 합니다.

팀의 다른 개발자들과 동일한 버전을 어떻게 유지할 수 있을까요? 또는 CI/CD 시스템과 동일한 버전을 어떻게 유지할 수 있을까요? 또는 프로덕션에서 사용되는 버전과 동일하게 유지할 수 있을까요?

Python(또는 Node 또는 데이터베이스)의 버전이 이미 설치된 것에 의해 영향을 받지 않도록 어떻게 할 수 있을까요? 잠재적인 충돌을 어떻게 관리할 수 있을까요?

여기서 컨테이너가 등장합니다!

컨테이너란 무엇인가요? 간단히 말해서 컨테이너는 앱의 각 구성 요소를 위한 독립된 프로세스입니다. 프론트엔드 React 앱, Python API 엔진, 데이터베이스와 같은 각 구성 요소들은 자신만의 독립된 환경에서 실행되어 다른 요소들과 완전히 분리됩니다.

컨테이너의 멋진 점은 다음과 같습니다. 컨테이너는:

- 자체 포함 (Self-contained): 각 컨테이너는 호스트 머신에 사전 설치된 종속성에 의존하지 않고 기능하는 데 필요한 모든 것을 포함합니다.
- 격리됨 (Isolated): 컨테이너는 격리된 상태로 실행되므로 호스트 및 다른 컨테이너에 미치는 영향이 최소화되어 애플리케이션의 보안이 향상됩니다.
- 독립적 (Independent): 각 컨테이너는 독립적으로 관리됩니다. 하나의 컨테이너를 삭제해도 다른 컨테이너에 영향을 미치지 않습니다.
- 이식성 (Portable): 컨테이너는 어디서나 실행될 수 있습니다! 개발 머신에서 실행되는 컨테이너는 데이터 센터나 클라우드 어디서나 동일하게 작동합니다!

### 컨테이너와 가상 머신(VM)의 비교 {#containers-versus-virtual-machines-vms}

너무 기술적인 설명은 제외하고 말씀드리면, VM은 자체 커널, 하드웨어 드라이버, 프로그램 및 애플리케이션을 포함한 전체 운영 체제입니다. 단순히 하나의 애플리케이션을 분리하기 위해 VM을 구동하는 것은 많은 시스템 자원이 낭비됩니다.

컨테이너는 단순히 실행에 필요한 모든 파일을 포함한 격리된 프로세스입니다. 여러 컨테이너를 실행하면 동일한 커널을 공유하여 더 적은 인프라로 더 많은 애플리케이션을 실행할 수 있습니다.

> **VM과 컨테이너를 함께 사용하기**
>
> 종종 컨테이너와 VM이 함께 사용되는 것을 볼 수 있습니다. 예를 들어, 클라우드 환경에서는 일반적으로 VM으로 서버를 구성합니다. 하나의 애플리케이션을 실행하기 위해 별도의 서버를 구성하는 대신, 컨테이너 실행 환경이 설치된 하나의 VM에서 여러 컨테이너화된 애플리케이션을 실행하면 자원 활용도를 높이고 비용을 절감할 수 있습니다.

## 실습해보기 {#try-it-out}

이 실습에서는 Docker Desktop GUI를 사용하여 Docker 컨테이너를 실행하는 방법을 배웁니다.

<Tabs>
<TabItem value="gui" label="GUI 사용하기">

다음 지침을 사용하여 컨테이너를 실행하세요.

1. Docker Desktop을 열고 상단 탐색 표시줄의 **Search** 필드를 선택합니다.

2. 검색 입력란에 `welcome-to-docker`를 지정한 다음 **Pull** 버튼을 선택합니다.

   ![welcome-to-docker Docker 이미지의 검색 결과를 보여주는 Docker Desktop 대시보드의 스크린샷](images/search-the-docker-image.webp?border=true&w=1000&h=700)

3. 이미지가 성공적으로 풀리면 **Run** 버튼을 선택합니다.

4. **Optional settings**를 확장합니다.

5. **Container name**에 `welcome-to-docker`를 지정합니다.

6. **Host port**에 `8080`을 지정합니다.

   ![컨테이너 이름으로 welcome-to-docker를 입력하고 포트 번호로 8080을 지정한 컨테이너 실행 대화 상자를 보여주는 Docker Desktop 대시보드의 스크린샷](images/run-a-new-container.webp?border=true&w=550&h=400)

7. **Run**을 선택하여 컨테이너를 시작합니다.

축하합니다! 첫 번째 컨테이너를 실행했습니다! 🎉

### 컨테이너 보기 {#view-your-container}

Docker Desktop 대시보드의 **Containers** 보기로 이동하여 모든 컨테이너를 볼 수 있습니다.

![호스트 포트 8080에서 실행 중인 welcome-to-docker 컨테이너를 보여주는 Docker Desktop GUI의 컨테이너 보기 스크린샷](images/view-your-containers.webp?border=true&w=750&h=600)

이 컨테이너는 간단한 웹사이트를 표시하는 웹 서버를 실행합니다. 더 복잡한 프로젝트를 작업할 때는 다른 컨테이너에서 다른 부분을 실행합니다. 예를 들어, 프론트엔드, 백엔드 및 데이터베이스를 각각 다른 컨테이너에서 실행할 수 있습니다.

### 웹 화면 확인하기 {#access-the-frontend}

컨테이너를 시작할 때 컨테이너의 포트 중 하나를 머신에 노출했습니다. 이를 통해 컨테이너의 격리된 환경을 통해 연결할 수 있는 구성을 생성하는 것으로 생각하세요.

이 컨테이너의 프론트엔드는 `8080` 포트에서 접근할 수 있습니다. 웹사이트를 열려면 컨테이너의 **Port(s)** 열에 있는 링크를 선택하거나 브라우저에서 [http://localhost:8080](https://localhost:8080)을 방문하세요.

![실행 중인 컨테이너에서 나오는 랜딩 페이지의 스크린샷](images/access-the-frontend.webp?border)

### 컨테이너 탐색하기 {#explore-your-container}

Docker Desktop을 사용하면 컨테이너의 다양한 측면을 탐색하고 상호 작용할 수 있습니다. 직접 시도해보세요.

1. Docker Desktop 대시보드의 **Containers** 보기로 이동합니다.

2. 컨테이너를 선택합니다.

3. **Files** 탭을 선택하여 컨테이너의 격리된 파일 시스템을 탐색합니다.

   ![실행 중인 컨테이너 내부의 파일 및 디렉터리를 보여주는 Docker Desktop 대시보드의 스크린샷](images/explore-your-container.webp?border)

### 컨테이너 중지하기 {#stop-your-container}

`docker/welcome-to-docker` 컨테이너는 중지할 때까지 계속 실행됩니다.

1. Docker Desktop 대시보드의 **Containers** 보기로 이동합니다.

2. 중지하려는 컨테이너를 찾습니다.

3. **Actions** 열에서 **Stop** 작업을 선택합니다.

   ![welcome 컨테이너를 선택하고 중지 준비 중인 Docker Desktop 대시보드의 스크린샷](images/stop-your-container.webp?border)

</TabItem>
<TabItem value="cli" label="CLI 사용하기">

CLI를 사용하여 컨테이너를 실행하려면 다음 지침을 따르세요:

1. CLI 터미널을 열고 [`docker run`](/reference/cli/docker/container/run/) 명령을 사용하여 컨테이너를 시작합니다:

   ```bash
   $ docker run -d -p 8080:80 docker/welcome-to-docker
   ```

   이 명령의 출력은 전체 컨테이너 ID입니다.

축하합니다! 첫 번째 컨테이너를 실행했습니다! 🎉

### 실행 중인 컨테이너 보기 {#view-your-running-containers}

[`docker ps`](/reference/cli/docker/container/ls/) 명령을 사용하여 컨테이너가 실행 중인지 확인할 수 있습니다:

```bash
docker ps
```

다음과 같은 출력이 표시됩니다:

```bash
 CONTAINER ID   IMAGE                      COMMAND                  CREATED          STATUS          PORTS                      NAMES
 a1f7a4bb3a27   docker/welcome-to-docker   "/docker-entrypoint.…"   11 seconds ago   Up 11 seconds   0.0.0.0:8080->80/tcp       gracious_keldysh
```

이 컨테이너는 간단한 웹사이트를 표시하는 웹 서버를 실행합니다. 더 복잡한 프로젝트를 작업할 때는 다른 컨테이너에서 다른 부분을 실행합니다. 예를 들어, 프론트엔드, 백엔드 및 데이터베이스를 각각 다른 컨테이너에서 실행할 수 있습니다.

:::tip
`docker ps` 명령은 _실행 중인_ 컨테이너만 표시합니다. 중지된 컨테이너를 보려면 `-a` 플래그를 추가하여 모든 컨테이너를 나열하세요: `docker ps -a`
:::

### 웹 화면 확인하기 {#access-the-frontend}

컨테이너를 시작할 때 컨테이너의 포트 중 하나를 머신에 노출했습니다. 이를 통해 컨테이너의 격리된 환경을 통해 연결할 수 있는 구성을 생성하는 것으로 생각하세요.

이 컨테이너의 프론트엔드는 `8080` 포트에서 접근할 수 있습니다. 웹사이트를 열려면 컨테이너의 **Port(s)** 열에 있는 링크를 선택하거나 브라우저에서 [http://localhost:8080](http://localhost:8080)을 방문하세요.

![실행 중인 컨테이너에서 나오는 Nginx 웹 서버의 랜딩 페이지 스크린샷](images/access-the-frontend.webp?border)

### 컨테이너 중지하기 {#stop-your-container}

`docker/welcome-to-docker` 컨테이너는 중지할 때까지 계속 실행됩니다. `docker stop` 명령을 사용하여 컨테이너를 중지할 수 있습니다.

1. `docker ps`를 실행하여 컨테이너 ID를 가져옵니다.

2. [`docker stop`](/reference/cli/docker/container/stop/) 명령에 컨테이너 ID 또는 이름을 제공합니다:

   ```bash
   docker stop <the-container-id>
   ```

:::tip
컨테이너를 ID로 참조할 때 전체 ID를 제공할 필요는 없습니다. ID의 일부만 제공하여 고유하게 만들면 됩니다. 예를 들어, 이전 컨테이너는 다음 명령을 실행하여 중지할 수 있습니다:

```bash
docker stop a1f
```

:::

</TabItem>
</Tabs>

## 추가 자료 {#additional-resources}

다음 링크는 컨테이너에 대한 추가 지침을 제공합니다:

- [컨테이너 실행](/engine/containers/run/)
- [컨테이너 개요](https://www.docker.com/resources/what-container/)
- [왜 Docker인가?](https://www.docker.com/why-docker/)

## 다음 단계 {#next-steps}

이제 Docker 컨테이너의 기본 사항을 배웠으므로 Docker 이미지에 대해 배울 차례입니다.

<Button href="what-is-an-image">이미지란 무엇인가?</Button>

---
title: Docker Compose란 무엇인가요?
weight: 40
keywords:
  - 개념
  - 빌드
  - 이미지
  - 컨테이너
  - 도커 데스크탑
description: Docker Compose란 무엇인가?
aliases:
  - /guides/walkthroughs/multi-container-apps/
  - /guides/docker-concepts/the-basics/what-is-docker-compose/
---

<YoutubeEmbed videoId="xhcUIK4fGtY" />

## 설명 {#explanation}

지금까지 가이드를 따라왔다면 단일 컨테이너 애플리케이션을 작업해왔을 것입니다. 하지만 이제 데이터베이스, 메시지 큐, 캐시 또는 다양한 다른 서비스를 실행하는 더 복잡한 작업을 하고 싶어질 것입니다. 모든 것을 단일 컨테이너에 설치하시겠습니까? 여러 컨테이너를 실행하시겠습니까? 여러 개를 실행한다면, 어떻게 모두 연결하시겠습니까?

컨테이너에 대한 하나의 모범 사례는 각 컨테이너가 하나의 작업을 잘 수행해야 한다는 것입니다. 이 규칙에는 예외가 있지만, 하나의 컨테이너가 여러 작업을 수행하도록 하는 경향을 피하십시오.

여러 `docker run` 명령을 사용하여 여러 컨테이너를 시작할 수 있습니다. 하지만 곧 네트워크를 관리하고, 컨테이너를 네트워크에 연결하기 위해 필요한 모든 플래그를 관리해야 한다는 것을 깨닫게 될 것입니다. 그리고 끝나면 정리하는 것이 조금 더 복잡해집니다.

Docker Compose를 사용하면 모든 컨테이너와 그 구성을 단일 YAML 파일에 정의할 수 있습니다. 이 파일을 코드 저장소에 포함시키면, 저장소를 클론하는 누구나 단일 명령으로 실행할 수 있습니다.

Compose는 선언적 도구라는 것을 이해하는 것이 중요합니다. 단순히 정의하고 실행하면 됩니다. 모든 것을 처음부터 다시 만들 필요는 없습니다. 변경 사항이 있으면 `docker compose up` 명령을 다시 실행하면 Compose가 파일의 변경 사항을 지능적으로 조정하고 적용합니다.

> **Dockerfile과 Compose 파일**
>
> Dockerfile은 컨테이너 이미지를 빌드하는 지침을 제공하는 반면, Compose 파일은 실행 중인 컨테이너를 정의합니다. 종종 Compose 파일은 특정 서비스에 사용할 이미지를 빌드하기 위해 Dockerfile을 참조합니다.

## 시도해보기 {#try-it-out}

이 실습에서는 Docker Compose를 사용하여 다중 컨테이너 애플리케이션을 실행하는 방법을 배웁니다. Node.js와 MySQL을 데이터베이스 서버로 사용하는 간단한 할 일 목록 앱을 사용합니다.

### 애플리케이션 시작 {#start-the-application}

시스템에서 할 일 목록 앱을 실행하는 지침을 따르십시오.

1. [Docker Desktop을 다운로드하고 설치](https://www.docker.com/products/docker-desktop/)합니다.
2. 터미널을 열고 [이 샘플 애플리케이션을 클론](https://github.com/dockersamples/todo-list-app)합니다.

   ```bash
   git clone https://github.com/dockersamples/todo-list-app
   ```

3. `todo-list-app` 디렉토리로 이동합니다:

   ```bash
   cd todo-list-app
   ```

   이 디렉토리 안에는 `compose.yaml`이라는 파일이 있습니다. 이 YAML 파일이 모든 마법을 일으킵니다! 이 파일은 애플리케이션을 구성하는 모든 서비스와 그 구성을 정의합니다. 각 서비스는 이미지, 포트, 볼륨, 네트워크 및 기능에 필요한 기타 설정을 지정합니다. YAML 파일의 구조를 탐색하고 익숙해지십시오.

4. [`docker compose up`](/reference/cli/docker/compose/up/) 명령을 사용하여 애플리케이션을 시작합니다:

   ```bash
   docker compose up -d --build
   ```

   이 명령을 실행하면 다음과 같은 출력이 표시됩니다:

   ```bash
   [+] Running 4/4
   ✔ app 3 layers [⣿⣿⣿]      0B/0B            Pulled           7.1s
     ✔ e6f4e57cc59e Download complete                          0.9s
     ✔ df998480d81d Download complete                          1.0s
     ✔ 31e174fedd23 Download complete                          2.5s
   [+] Running 2/4
     ⠸ Network todo-list-app_default           Created         0.3s
     ⠸ Volume "todo-list-app_todo-mysql-data"  Created         0.3s
     ✔ Container todo-list-app-app-1           Started         0.3s
     ✔ Container todo-list-app-mysql-1         Started         0.3s
   ```

   여기서 많은 일이 일어났습니다! 몇 가지 중요한 사항을 언급하자면:

   - Docker Hub에서 node와 MySQL 두 개의 컨테이너 이미지를 다운로드했습니다.
   - 애플리케이션을 위한 네트워크가 생성되었습니다
   - 데이터베이스 파일을 컨테이너 재시작 간에 유지하기 위한 볼륨이 생성되었습니다
   - 필요한 모든 구성으로 두 개의 컨테이너가 시작되었습니다

   이 모든 것이 복잡하게 느껴지더라도 걱정하지 마세요! 곧 익숙해질 거예요!

5. 이제 모든 것이 실행 중이므로 브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 사이트를 확인할 수 있습니다. 목록에 항목을 추가하고, 체크하고, 제거해보십시오.

   ![포트 3000에서 실행 중인 할 일 목록 애플리케이션을 보여주는 웹페이지의 스크린샷](images/todo-list-app.webp?border=true&w=950&h=400)

6. Docker Desktop GUI를 보면 컨테이너를 확인하고 구성에 대해 더 깊이 탐구할 수 있습니다.

   ![할 일 목록 앱을 실행 중인 컨테이너 목록을 보여주는 Docker Desktop 대시보드의 스크린샷](images/todo-list-containers.webp?border=true&w=950&h=400)

### 종료하기 {#tear-it-down}

이 애플리케이션은 Docker Compose를 사용하여 시작되었으므로 완료되면 모든 것을 쉽게 종료할 수 있습니다.

1. CLI에서 [`docker compose down`](/reference/cli/docker/compose/down/) 명령을 사용하여 모든 것을 제거합니다:

   ```bash
   docker compose down
   ```

   다음과 유사한 출력이 표시됩니다:

   ```bash
   [+] Running 2/2
   ✔ Container todo-list-app-mysql-1  Removed        2.9s
   ✔ Container todo-list-app-app-1    Removed        0.1s
   ✔ Network todo-list-app_default    Removed        0.1s
   ```

   > **볼륨 지속성**
   >
   > 기본적으로, Compose 스택을 종료할 때 볼륨은 자동으로 제거되지 않습니다. 스택을 다시 시작할 때 데이터를 복원하고 싶을 수 있기 때문입니다.
   >
   > 볼륨을 제거하려면 `docker compose down` 명령을 실행할 때 `--volumes` 플래그를 추가하십시오:
   >
   > ```bash
   > docker compose down --volumes
   > ```

2. 또는 Docker Desktop GUI를 사용하여 애플리케이션 스택을 선택하고 **Delete** 버튼을 선택하여 컨테이너를 제거할 수 있습니다.

   ![컨테이너 보기에서 "삭제" 버튼을 가리키는 화살표가 있는 Docker Desktop GUI의 스크린샷](images/todo-list-delete.webp?w=930&h=400)

   > **GUI를 사용한 Compose 스택**
   >
   > GUI에서 Compose 앱의 컨테이너를 제거하면 컨테이너만 제거됩니다. 네트워크와 볼륨을 제거하려면 수동으로 제거해야 합니다.

이번 학습에서는 Docker Compose를 사용하여 다중 컨테이너 애플리케이션을 시작하고 중지하는 방법을 배웠습니다.

## 추가 자료 {#additional-resources}

이 페이지는 Compose에 대한 간략한 소개였습니다. 다음 자료에서 Compose와 Compose 파일 작성 방법에 대해 더 깊이 탐구할 수 있습니다.

- [Docker Compose 개요](/compose/)
- [Docker Compose CLI 개요](/compose/reference/)
- [Compose 작동 방식](/compose/intro/compose-application-model/)

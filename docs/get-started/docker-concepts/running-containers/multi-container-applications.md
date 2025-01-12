---
title: 다중 컨테이너 애플리케이션
weight: 5
keywords:
  - 개념
  - 빌드
  - 이미지
  - 컨테이너
  - 도커 데스크탑
description: 이 개념 페이지에서는 다중 컨테이너 애플리케이션의 중요성과 단일 컨테이너 애플리케이션과의 차이점을 배웁니다.
aliases:
  - /guides/docker-concepts/running-containers/multi-container-applications/
---

<YoutubeEmbed videoId="1jUwR6F9hvM" />

## 설명 {#Explanation}

단일 컨테이너 애플리케이션을 시작하는 것은 쉽습니다. 예를 들어, 특정 데이터 처리 작업을 수행하는 Python 스크립트는 모든 종속성과 함께 컨테이너 내에서 실행됩니다. 마찬가지로, 작은 API 엔드포인트를 제공하는 정적 웹사이트를 제공하는 Node.js 애플리케이션도 필요한 모든 라이브러리와 종속성과 함께 효과적으로 컨테이너화할 수 있습니다. 그러나 애플리케이션이 커짐에 따라 개별 컨테이너로 관리하는 것이 더 어려워집니다.

데이터 처리 Python 스크립트가 데이터베이스에 연결해야 한다고 상상해보세요. 갑자기 스크립트뿐만 아니라 동일한 컨테이너 내에서 데이터베이스 서버도 관리해야 합니다. 스크립트가 사용자 로그인을 필요로 한다면 인증 메커니즘도 필요하게 되어 컨테이너 크기가 더 커집니다.

컨테이너에 대한 모범 사례 중 하나는 각 컨테이너가 한 가지 일을 잘 수행해야 한다는 것입니다. 이 규칙에는 예외가 있지만, 하나의 컨테이너가 여러 작업을 수행하도록 하는 경향을 피해야 합니다.

이제 "이 컨테이너들을 따로 실행해야 하나요? 따로 실행하면 어떻게 모두 연결하나요?"라는 질문이 생길 수 있습니다.

`docker run`은 컨테이너를 시작하는 데 편리한 도구이지만, 애플리케이션 규모가 커지면 관리하기 어려워집니다. 그 이유는 다음과 같습니다:

- 개발, 테스트 및 프로덕션 환경에 대해 다른 구성으로 여러 `docker run` 명령어(프론트엔드, 백엔드 및 데이터베이스)를 실행한다고 상상해보세요. 오류가 발생하기 쉽고 시간이 많이 소요됩니다.
- 애플리케이션은 종종 서로 의존합니다. 특정 순서로 컨테이너를 수동으로 시작하고 네트워크 연결을 관리하는 것은 규모가 확장됨에 따라 어려워집니다.
- 각 애플리케이션은 자체 `docker run` 명령어가 필요하여 개별 서비스를 확장하기 어렵습니다. 전체 애플리케이션을 확장하면 부스트가 필요하지 않은 구성 요소에 자원을 낭비할 수 있습니다.
- 각 애플리케이션의 데이터를 지속하려면 별도의 볼륨 마운트 또는 각 `docker run` 명령어 내에서 구성이 필요합니다. 이는 분산된 데이터 관리 접근 방식을 만듭니다.
- 각 애플리케이션에 대해 별도의 `docker run` 명령어를 통해 환경 변수를 설정하는 것은 번거롭고 오류가 발생하기 쉽습니다.

이때 Docker Compose가 구원에 나섭니다.

Docker Compose는 전체 다중 컨테이너 애플리케이션을 `compose.yml`이라는 단일 YAML 파일에 정의합니다. 이 파일은 모든 컨테이너의 구성, 종속성, 환경 변수, 볼륨 및 네트워크를 지정합니다. Docker Compose를 사용하면:

- 여러 `docker run` 명령어를 실행할 필요가 없습니다. 전체 다중 컨테이너 애플리케이션을 단일 YAML 파일에 정의하기만 하면 됩니다. 이렇게 하면 구성이 중앙 집중화되고 관리가 간소화됩니다.
- 특정 순서로 컨테이너를 실행하고 네트워크 연결을 쉽게 관리할 수 있습니다.
- 다중 컨테이너 설정 내에서 개별 서비스를 간단히 확장할 수 있습니다. 이를 통해 실시간 요구에 따라 효율적으로 자원을 할당할 수 있습니다.
- 지속적인 볼륨을 쉽게 구현할 수 있습니다.
- Docker Compose 파일에서 한 번에 환경 변수를 설정하는 것이 쉽습니다.

Docker Compose를 사용하여 다중 컨테이너 설정을 실행하면 모듈성, 확장성 및 일관성을 갖춘 복잡한 애플리케이션을 구축할 수 있습니다.

## 시도해보기 {#Try-it-out}

이 실습 가이드에서는 `docker run` 명령어를 사용하여 Node.js 기반의 카운터 웹 애플리케이션, Nginx 리버스 프록시 및 Redis 데이터베이스를 빌드하고 실행하는 방법을 먼저 살펴봅니다. 또한 Docker Compose를 사용하여 전체 배포 프로세스를 간소화하는 방법도 살펴봅니다.

### 설정 {#Set-up}

1. 샘플 애플리케이션을 가져옵니다. Git이 있는 경우 샘플 애플리케이션의 리포지토리를 클론할 수 있습니다. 그렇지 않으면 샘플 애플리케이션을 다운로드할 수 있습니다. 다음 옵션 중 하나를 선택하세요.

   <Tabs>
   <TabItem value="clone" label="Git으로 클론">
      터미널에서 다음 명령어를 사용하여 샘플 애플리케이션 리포지토리를 클론합니다.

   ```bash
   git clone https://github.com/dockersamples/nginx-node-redis
   ```

   `nginx-node-redis` 디렉토리로 이동합니다:

   ```bash
   cd nginx-node-redis
   ```

   이 디렉토리 내에는 `nginx` 및 `web`이라는 두 개의 하위 디렉토리가 있습니다.
   </TabItem>

   <TabItem value="download" label="다운로드">
      리포지토리를 다운로드하는 방법에 대한 세부 정보 또는 지침을 제공합니다.
   </TabItem>
   </Tabs>

   소스를 다운로드하고 압축을 풉니다.

   <Button url="https://github.com/dockersamples/nginx-node-redis/archive/refs/heads/main.zip">소스 다운로드</Button>

`nginx-node-redis-main` 디렉토리로 이동합니다:

```bash
$ cd nginx-node-redis-main
```

이 디렉토리 내에는 `nginx` 및 `web`이라는 두 개의 하위 디렉토리가 있습니다.

2. [Docker Desktop을 다운로드하고 설치합니다](/get-started/get-docker.md).

### 이미지 빌드 {#Build-the-images}

1. `nginx` 디렉토리로 이동하여 다음 명령어를 실행하여 이미지를 빌드합니다:

   ```bash
   $ docker build -t nginx .
   ```

2. `web` 디렉토리로 이동하여 다음 명령어를 실행하여 첫 번째 웹 이미지를 빌드합니다:

   ```bash
   $ docker build -t web .
   ```

### 컨테이너 실행 {#Run-the-containers}

1. 다중 컨테이너 애플리케이션을 실행하기 전에 모든 컨테이너가 통신할 수 있는 네트워크를 생성해야 합니다. `docker network create` 명령어를 사용하여 네트워크를 생성할 수 있습니다:

   ```bash
   $ docker network create sample-app
   ```

2. Redis 컨테이너를 시작하려면 다음 명령어를 실행하여 이전에 생성한 네트워크에 연결하고 DNS 조회에 유용한 네트워크 별칭을 생성합니다:

   ```bash
   $ docker run -d --name redis --network sample-app --network-alias redis redis
   ```

3. 첫 번째 웹 컨테이너를 시작하려면 다음 명령어를 실행합니다:

   ```bash
   $ docker run -d --name web1 -h web1 --network sample-app --network-alias web1 web
   ```

4. 두 번째 웹 컨테이너를 시작하려면 다음 명령어를 실행합니다:

   ```bash
   $ docker run -d --name web2 -h web2 --network sample-app --network-alias web2 web
   ```

5. Nginx 컨테이너를 시작하려면 다음 명령어를 실행합니다:

   ```bash
   $ docker run -d --name nginx --network sample-app  -p 80:80 nginx
   ```

   :::note
   Nginx는 일반적으로 웹 애플리케이션을 위한 리버스 프록시로 사용되며, 트래픽을 백엔드 서버로 라우팅합니다. 이 경우, Node.js 백엔드 컨테이너(web1 또는 web2)로 라우팅합니다.
   :::

6. 다음 명령어를 실행하여 컨테이너가 실행 중인지 확인합니다:

   ```bash
   $ docker ps
   ```

   다음과 같은 출력이 표시됩니다:

   ```text
   CONTAINER ID   IMAGE     COMMAND                  CREATED              STATUS              PORTS                NAMES
   2cf7c484c144   nginx     "/docker-entrypoint.…"   9 seconds ago        Up 8 seconds        0.0.0.0:80->80/tcp   nginx
   7a070c9ffeaa   web       "docker-entrypoint.s…"   19 seconds ago       Up 18 seconds                            web2
   6dc6d4e60aaf   web       "docker-entrypoint.s…"   34 seconds ago       Up 33 seconds                            web1
   008e0ecf4f36   redis     "docker-entrypoint.s…"   About a minute ago   Up About a minute   6379/tcp             redis
   ```

7. Docker Desktop 대시보드를 보면 컨테이너를 확인하고 구성에 대해 더 자세히 알아볼 수 있습니다.

   ![다중 컨테이너 애플리케이션을 보여주는 Docker Desktop 대시보드의 스크린샷](images/multi-container-apps.webp?w=5000&border=true)

8. 모든 것이 실행 중이면 브라우저에서 [http://localhost](http://localhost)를 열어 사이트를 확인할 수 있습니다. 페이지를 여러 번 새로 고침하여 요청을 처리하는 호스트와 총 요청 수를 확인할 수 있습니다:

   ```bash
   web2: Number of visits is: 9
   web1: Number of visits is: 10
   web2: Number of visits is: 11
   web1: Number of visits is: 12
   ```

   :::note
   Nginx가 리버스 프록시로 작동하여 들어오는 요청을 두 개의 백엔드 컨테이너(web1 및 web2) 사이에서 라운드 로빈 방식으로 분배하는 것을 알 수 있습니다. 이는 각 요청이 순환 방식으로 다른 컨테이너로 전달될 수 있음을 의미합니다. 출력은 web1 및 web2 컨테이너의 연속적인 증가를 보여주며, 실제 카운터 값은 클라이언트에게 응답이 반환된 후에만 Redis에 업데이트됩니다.
   :::

9. Docker Desktop 대시보드를 사용하여 컨테이너를 제거하려면 컨테이너를 선택하고 **Delete** 버튼을 선택합니다.

   ![다중 컨테이너 애플리케이션을 삭제하는 방법을 보여주는 Docker Desktop 대시보드의 스크린샷](images/delete-multi-container-apps.webp?border=true)

## Docker Compose를 사용하여 배포 간소화 {#Simplify-the-deployment-using-Docker-Compose}

Docker Compose는 다중 컨테이너 배포를 관리하기 위한 구조적이고 간소화된 접근 방식을 제공합니다. 앞서 언급했듯이, Docker Compose를 사용하면 여러 `docker run` 명령어를 실행할 필요가 없습니다. 전체 다중 컨테이너 애플리케이션을 `compose.yml`이라는 단일 YAML 파일에 정의하기만 하면 됩니다. 작동 방식을 살펴보겠습니다.

프로젝트 디렉토리의 루트로 이동합니다. 이 디렉토리 내에는 `compose.yml`이라는 파일이 있습니다. 이 YAML 파일이 모든 마법이 일어나는 곳입니다. 이 파일은 애플리케이션을 구성하는 모든 서비스를 정의하고, 각 서비스의 이미지, 포트, 볼륨, 네트워크 및 필요한 기타 설정을 지정합니다.

1. `docker compose up` 명령어를 사용하여 애플리케이션을 시작합니다:

   ```bash
   $ docker compose up -d --build
   ```

   이 명령어를 실행하면 다음과 유사한 출력이 표시됩니다:

   ```bash
   Running 5/5
   ✔ Network nginx-nodejs-redis_default    Created                                                0.0s
   ✔ Container nginx-nodejs-redis-web1-1   Started                                                0.1s
   ✔ Container nginx-nodejs-redis-redis-1  Started                                                0.1s
   ✔ Container nginx-nodejs-redis-web2-1   Started                                                0.1s
   ✔ Container nginx-nodejs-redis-nginx-1  Started
   ```

2. Docker Desktop 대시보드를 보면 컨테이너를 확인하고 구성에 대해 더 자세히 알아볼 수 있습니다.

   ![Docker Compose를 사용하여 배포한 애플리케이션 규모가 컨테이너를 보여주는 Docker Desktop 대시보드의 스크린샷](images/list-containers.webp?border=true)

3. 또는 Docker Desktop 대시보드를 사용하여 애플리케이션 규모를 선택하고 **Delete** 버튼을 선택하여 컨테이너를 제거할 수 있습니다.

   ![Docker Compose를 사용하여 배포한 컨테이너를 제거하는 방법을 보여주는 Docker Desktop 대시보드의 스크린샷](images/delete-containers.webp?border=true)

이 가이드에서는 `docker run`이 오류가 발생하기 쉽고 관리하기 어려운 것에 비해 Docker Compose를 사용하여 다중 컨테이너 애플리케이션을 시작하고 중지하는 것이 얼마나 쉬운지 배웠습니다.

## 추가 자료 {#Additional-resources}

- [`docker container run` CLI 참조](reference/cli/docker/container/run/)
- [Docker Compose란 무엇인가](/get-started/docker-concepts/the-basics/what-is-docker-compose/)

---
title: Docker Compose 사용하기
weight: 80
linkTitle: "Part 7: Use Docker Compose"
keywords:
  - 시작하기
  - 설정
  - 오리엔테이션
  - 빠른 시작
  - 소개
  - 개념
  - 컨테이너
  - 도커 데스크탑
description: 다중 컨테이너 애플리케이션을 위한 Docker Compose 사용
aliases:
  - /get-started/08_using_compose/
  - /guides/workshop/08_using_compose/
---

[Docker Compose](/manuals/compose/_index.md)는 다중 컨테이너 애플리케이션을 정의하고
공유하는 데 도움이 되는 도구입니다. Compose를 사용하면 서비스를 정의하는 YAML 파일을 만들 수 있으며, 단일 명령으로 모든 것을 시작하거나 종료할 수 있습니다.

Compose를 사용하는 큰 장점은 애플리케이션 스택을 파일에 정의하고 프로젝트 저장소의 루트에 보관할 수 있으며(이제 버전 관리됨), 다른 사람이 프로젝트에 쉽게 기여할 수 있다는 것입니다. 누군가가 저장소를 클론하고 Compose를 사용하여 앱을 시작하기만 하면 됩니다. 실제로 GitHub/GitLab에서 정확히 이렇게 하는 프로젝트를 많이 볼 수 있습니다.

## Compose 파일 생성 {#create-the-compose-file}

`getting-started-app` 디렉토리에서 `compose.yaml`이라는 파일을 만듭니다.

```text
├── getting-started-app/
│ ├── Dockerfile
│ ├── compose.yaml
│ ├── node_modules/
│ ├── package.json
│ ├── spec/
│ ├── src/
│ └── yarn.lock
```

## 앱 서비스 정의 {#define-the-app-service}

[part 6](./07_multi_container.md)에서 애플리케이션 서비스를 시작하기 위해 다음 명령을 사용했습니다.

```bash
$ docker run -dp 127.0.0.1:3000:3000 \
  -w /app -v "$(pwd):/app" \
  --network todo-app \
  -e MYSQL_HOST=mysql \
  -e MYSQL_USER=root \
  -e MYSQL_PASSWORD=secret \
  -e MYSQL_DB=todos \
  node:18-alpine \
  sh -c "yarn install && yarn run dev"
```

이제 이 서비스를 `compose.yaml` 파일에 정의합니다.

1. 텍스트 또는 코드 편집기에서 `compose.yaml`을 열고 애플리케이션의 일부로 실행하려는 첫 번째 서비스(또는 컨테이너)의 이름과 이미지를 정의하는 것으로 시작합니다. 이름은 자동으로 네트워크 별칭이 되며, MySQL 서비스를 정의할 때 유용합니다.

   ```yaml
   services:
     app:
       image: node:18-alpine
   ```

2. 일반적으로 `command`는 `image` 정의 근처에 있지만, 순서에 대한 요구 사항은 없습니다. `compose.yaml` 파일에 `command`를 추가합니다.

   ```yaml
   services:
     app:
       image: node:18-alpine
       command: sh -c "yarn install && yarn run dev"
   ```

3. 이제 명령의 `-p 127.0.0.1:3000:3000` 부분을 서비스의 `ports`로 정의합니다.

   ```yaml
   services:
     app:
       image: node:18-alpine
       command: sh -c "yarn install && yarn run dev"
       ports:
         - 127.0.0.1:3000:3000
   ```

4. 다음으로 작업 디렉토리(`-w /app`)와 볼륨 매핑(`-v "$(pwd):/app"`)을 `working_dir` 및 `volumes` 정의를 사용하여 마이그레이션합니다.

   Docker Compose 볼륨 정의의 한 가지 장점은 현재 디렉토리에서 상대 경로를 사용할 수 있다는 것입니다.

   ```yaml
   services:
     app:
       image: node:18-alpine
       command: sh -c "yarn install && yarn run dev"
       ports:
         - 127.0.0.1:3000:3000
       working_dir: /app
       volumes:
         - ./:/app
   ```

5. 마지막으로 환경 변수 정의를 `environment` 키를 사용하여 마이그레이션해야 합니다.

   ```yaml
   services:
     app:
       image: node:18-alpine
       command: sh -c "yarn install && yarn run dev"
       ports:
         - 127.0.0.1:3000:3000
       working_dir: /app
       volumes:
         - ./:/app
       environment:
         MYSQL_HOST: mysql
         MYSQL_USER: root
         MYSQL_PASSWORD: secret
         MYSQL_DB: todos
   ```

### MySQL 서비스 정의 {#define-the-mysql-service}

이제 MySQL 서비스를 정의할 시간입니다. 해당 컨테이너에 사용한 명령은 다음과 같습니다.

```bash
$ docker run -d \
  --network todo-app --network-alias mysql \
  -v todo-mysql-data:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=secret \
  -e MYSQL_DATABASE=todos \
  mysql:8.0
```

1. 먼저 새 서비스를 정의하고 `mysql`이라고 이름을 지정하여 자동으로 네트워크 별칭을 얻도록 합니다. 또한 사용할 이미지를 지정합니다.

   ```yaml
   services:
     app:
       # The app service definition
     mysql:
       image: mysql:8.0
   ```

2. 다음으로 볼륨 매핑을 정의합니다. `docker run`으로 컨테이너를 실행할 때 Docker는 자동으로 명명된 볼륨을 생성했습니다. 그러나 Compose로 실행할 때는 그렇지 않습니다. 상위 수준의 `volumes:` 섹션에서 볼륨을 정의한 다음 서비스 구성에서 마운트 지점을 지정해야 합니다. 볼륨 이름만 제공하면 기본 옵션이 사용됩니다.

   ```yaml
   services:
     app:
       # The app service definition
     mysql:
       image: mysql:8.0
       volumes:
         - todo-mysql-data:/var/lib/mysql

   volumes:
     todo-mysql-data:
   ```

3. 마지막으로 환경 변수를 지정해야 합니다.

   ```yaml
   services:
     app:
       # The app service definition
     mysql:
       image: mysql:8.0
       volumes:
         - todo-mysql-data:/var/lib/mysql
       environment:
         MYSQL_ROOT_PASSWORD: secret
         MYSQL_DATABASE: todos

   volumes:
     todo-mysql-data:
   ```

이 시점에서 전체 `compose.yaml`은 다음과 같아야 합니다:

```yaml
services:
  app:
    image: node:18-alpine
    command: sh -c "yarn install && yarn run dev"
    ports:
      - 127.0.0.1:3000:3000
    working_dir: /app
    volumes:
      - ./:/app
    environment:
      MYSQL_HOST: mysql
      MYSQL_USER: root
      MYSQL_PASSWORD: secret
      MYSQL_DB: todos

  mysql:
    image: mysql:8.0
    volumes:
      - todo-mysql-data:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: todos

volumes:
  todo-mysql-data:
```

## 애플리케이션 스택 실행 {#run-the-application-stack}

이제 `compose.yaml` 파일이 있으므로 애플리케이션을 시작할 수 있습니다.

1. 먼저 다른 컨테이너의 복사본이 실행 중이지 않은지 확인합니다. `docker ps`를 사용하여 컨테이너를 나열하고 `docker rm -f <ids>`를 사용하여 제거합니다.

2. `docker compose up` 명령을 사용하여 애플리케이션 스택을 시작합니다. 모든 것을 백그라운드에서 실행하려면 `-d` 플래그를 추가합니다.

   ```bash
   $ docker compose up -d
   ```

   이전 명령을 실행하면 다음과 같은 출력이 표시됩니다:

   ```plaintext
   Creating network "app_default" with the default driver
   Creating volume "app_todo-mysql-data" with default driver
   Creating app_app_1   ... done
   Creating app_mysql_1 ... done
   ```

   Docker Compose가 볼륨과 네트워크를 생성한 것을 알 수 있습니다. 기본적으로 Docker Compose는 애플리케이션 스택을 위해 특별히 네트워크를 자동으로 생성합니다(따라서 Compose 파일에서 네트워크를 정의하지 않았습니다).

3. `docker compose logs -f` 명령을 사용하여 로그를 확인합니다. 각 서비스의 로그가 단일 스트림으로 혼합되어 표시됩니다. 이는 타이밍 관련 문제를 확인할 때 매우 유용합니다. `-f` 플래그는 로그를 따라가므로 생성될 때 실시간 출력을 제공합니다.

   이미 명령을 실행한 경우 다음과 같은 출력이 표시됩니다:

   ```plaintext
   mysql_1  | 2019-10-03T03:07:16.083639Z 0 [Note] mysqld: ready for connections.
   mysql_1  | Version: '8.0.31'  socket: '/var/run/mysqld/mysqld.sock'  port: 3306  MySQL Community Server (GPL)
   app_1    | Connected to mysql db at host mysql
   app_1    | Listening on port 3000
   ```

   서비스 이름은 줄의 시작 부분에 표시되어 메시지를 구분하는 데 도움이 됩니다(종종 색상이 지정됨). 특정 서비스의 로그를 보려면 로그 명령 끝에 서비스 이름을 추가할 수 있습니다(예: `docker compose logs -f app`).

4. 이 시점에서 [http://localhost:3000](http://localhost:3000)에서 브라우저로 앱을 열고 실행 중인 것을 확인할 수 있어야 합니다.

## Docker Desktop 대시보드에서 앱 스택 보기 {#see-the-app-stack-in-docker-desktop-dashboard}

Docker Desktop 대시보드를 보면 **getting-started-app**이라는 그룹이 있습니다. 이는 Docker Compose의 프로젝트 이름이며 컨테이너를 함께 그룹화하는 데 사용됩니다. 기본적으로 프로젝트 이름은 `compose.yaml`이 위치한 디렉토리의 이름입니다.

스택을 확장하면 Compose 파일에 정의된 두 컨테이너가 표시됩니다. 이름도 `<service-name>-<replica-number>` 패턴을 따르므로 앱이 어떤 컨테이너인지, mysql 데이터베이스가 어떤 컨테이너인지 쉽게 알 수 있습니다.

## 모두 종료하기 {#tear-it-all-down}

모두 종료할 준비가 되면 `docker compose down` 명령을 실행하거나 Docker Desktop 대시보드에서 전체 앱 스택에 대해 휴지통 아이콘을 클릭합니다. 컨테이너가 중지되고 네트워크가 제거됩니다.

> [!WARNING]
>
> 기본적으로, `docker compose down`을 실행할 때 Compose 파일의 명명된 볼륨은 제거되지 않습니다. 볼륨을 제거하려면 `--volumes` 플래그를 추가해야 합니다.
>
> Docker Desktop 대시보드는 앱 스택을 삭제할 때 볼륨을 제거하지 않습니다.

## 요약 {#summary}

이 섹션에서는 Docker Compose에 대해 배우고 다중 서비스 애플리케이션을 정의하고 공유하는 방법을 단순화하는 방법을 배웠습니다.

관련 정보:

- [Compose 개요](/manuals/compose/_index.md)
- [Compose 파일 참조](/reference/compose-file/_index.md)
- [Compose CLI 참조](/reference/cli/docker/compose/_index.md)

## 다음 단계 {#next-steps}

다음으로 Dockerfile을 개선하는 데 사용할 수 있는 몇 가지 모범 사례에 대해 배웁니다.

<Button href="09_image_best.md">이미지 빌드 모범 사례</Button>

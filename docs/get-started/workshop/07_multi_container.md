---
title: 다중 컨테이너 앱
weight: 70
linkTitle: "Part 6: Multi-container apps"
keywords:
  - 시작하기
  - 설정
  - 오리엔테이션
  - 빠른 시작
  - 소개
  - 개념
  - 컨테이너
  - 도커 데스크탑
description: 애플리케이션에서 둘 이상의 컨테이너 사용
aliases:
  - /get-started/07_multi_container/
  - /guides/workshop/07_multi_container/
---

지금까지 단일 컨테이너 앱을 사용해 왔습니다. 이제 MySQL을 애플리케이션 스택에 추가할 것입니다. "MySQL은 어디에서 실행됩니까? 동일한 컨테이너에 설치하거나 별도로 실행합니까?"과 같은 질문이 자주 발생합니다 - 일반적으로 각 컨테이너는 한 가지 일을 잘 수행해야 합니다. 다음은 컨테이너를 별도로 실행해야 하는 몇 가지 이유입니다:

- API와 프론트엔드를 데이터베이스와 다르게 규모를 키워야 할 가능성이 큽니다.
- 별도의 컨테이너는 버전을 격리하여 업데이트할 수 있습니다.
- 로컬에서는 데이터베이스를 위해 컨테이너를 사용할 수 있지만, 프로덕션에서는 관리형 서비스를 사용하고 싶을 수 있습니다. 이 경우 데이터베이스 엔진을 애플리케이션과 함께 배포하고 싶지 않을 것입니다.
- 여러 프로세스를 실행하려면 프로세스 관리자가 필요하며(컨테이너는 하나의 프로세스만 시작함), 이는 컨테이너 시작/종료에 복잡성을 추가합니다.

그리고 더 많은 이유가 있습니다. 따라서 다음 다이어그램과 같이 애플리케이션을 여러 컨테이너에서 실행하는 것이 좋습니다.

![Todo App connected to MySQL container](images/multi-container.webp?w=350h=250)

## 컨테이너 네트워킹 {#container-networking}

기본적으로 컨테이너는 격리되어 실행되며 동일한 머신의 다른 프로세스나 컨테이너에 대해 아무것도 알지 못합니다. 그렇다면 한 컨테이너가 다른 컨테이너와 통신하려면 어떻게 해야 할까요? 답은 네트워킹입니다. 두 컨테이너를 동일한 네트워크에 배치하면 서로 통신할 수 있습니다.

## MySQL 시작 {#start-mysql}

컨테이너를 네트워크에 연결하는 방법은 두 가지가 있습니다:

- 컨테이너를 시작할 때 네트워크를 할당합니다.
- 이미 실행 중인 컨테이너를 네트워크에 연결합니다.

다음 단계에서는 네트워크를 먼저 생성한 다음 MySQL 컨테이너를 시작할 때 연결합니다.

1. 네트워크를 생성합니다.

   ```bash
   $ docker network create todo-app
   ```

2. MySQL 컨테이너를 시작하고 네트워크에 연결합니다. 데이터베이스를 초기화하는 데 사용할 몇 가지 환경 변수를 정의할 것입니다. MySQL 환경 변수에 대해 자세히 알아보려면 [MySQL Docker Hub 목록](https://hub.docker.com/_/mysql/)의 "환경 변수" 섹션을 참조하세요.

<Tabs>
  <TabItem value="mac-linux-gitbash" label="Mac / Linux / Git Bash">
    ```bash
    docker run -d \
        --network todo-app --network-alias mysql \
        -v todo-mysql-data:/var/lib/mysql \
        -e MYSQL_ROOT_PASSWORD=secret \
        -e MYSQL_DATABASE=todos \
        mysql:8.0
    ```
  </TabItem>

  <TabItem value="powershell" label="PowerShell">
    ```powershell
    docker run -d `
        --network todo-app --network-alias mysql `
        -v todo-mysql-data:/var/lib/mysql `
        -e MYSQL_ROOT_PASSWORD=secret `
        -e MYSQL_DATABASE=todos `
        mysql:8.0
    ```
  </TabItem>

  <TabItem value="command-prompt" label="Command Prompt">
    ```cmd
    docker run -d ^
        --network todo-app --network-alias mysql ^
        -v todo-mysql-data:/var/lib/mysql ^
        -e MYSQL_ROOT_PASSWORD=secret ^
        -e MYSQL_DATABASE=todos ^
        mysql:8.0
    ```
  </TabItem>
</Tabs>
   
   이전 명령에서 `--network-alias` 플래그를 볼 수 있습니다. 나중 섹션에서 이 플래그에 대해 더 자세히 배울 것입니다.

:::tip
위 명령에서 `/var/lib/mysql`에 마운트된 `todo-mysql-data`라는 볼륨을 볼 수 있습니다. 그러나 `docker volume create` 명령을 실행하지 않았습니다. Docker는 명명된 볼륨을 사용하려는 것을 인식하고 자동으로 하나를 생성합니다.
:::

3. 데이터베이스가 실행 중인지 확인하려면 데이터베이스에 연결하고 연결을 확인합니다.

   ```bash
   $ docker exec -it <mysql-container-id> mysql -u root -p
   ```

   비밀번호 프롬프트가 나타나면 `secret`을 입력합니다. MySQL 셸에서 데이터베이스를 나열하고 `todos` 데이터베이스가 있는지 확인합니다.

   ```bash
   mysql> SHOW DATABASES;
   ```

   다음과 같은 출력이 표시되어야 합니다:

   ```plaintext
   +--------------------+
   | Database           |
   +--------------------+
   | information_schema |
   | mysql              |
   | performance_schema |
   | sys                |
   | todos              |
   +--------------------+
   5 rows in set (0.00 sec)
   ```

4. MySQL 셸을 종료하여 머신의 셸로 돌아갑니다.

   ```bash
   mysql> exit
   ```

   이제 `todos` 데이터베이스가 준비되었습니다.

## MySQL에 연결 {#connect-to-mysql}

이제 MySQL이 실행 중인 것을 알았으므로 사용할 수 있습니다. 그러나 어떻게 사용할까요? 동일한 네트워크에서 다른 컨테이너를 실행하면 컨테이너를 어떻게 찾을 수 있을까요? 각 컨테이너는 고유한 IP 주소를 가지고 있습니다.

위 질문에 답하고 컨테이너 네트워킹을 더 잘 이해하기 위해 [nicolaka/netshoot](https://github.com/nicolaka/netshoot) 컨테이너를 사용할 것입니다. 이 컨테이너는 네트워킹 문제를 해결하거나 디버깅하는 데 유용한 많은 도구를 제공합니다.

1. nicolaka/netshoot 이미지를 사용하여 새 컨테이너를 시작합니다. 동일한 네트워크에 연결해야 합니다.

   ```bash
   $ docker run -it --network todo-app nicolaka/netshoot
   ```

2. 컨테이너 내부에서 유용한 DNS 도구인 `dig` 명령을 사용할 것입니다. `mysql` 호스트 이름의 IP 주소를 조회할 것입니다.

   ```bash
   $ dig mysql
   ```

   다음과 같은 출력이 표시되어야 합니다.

   ```text
   ; <<>> DiG 9.18.8 <<>> mysql
   ;; global options: +cmd
   ;; Got answer:
   ;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 32162
   ;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 0

   ;; QUESTION SECTION:
   ;mysql.				IN	A

   ;; ANSWER SECTION:
   mysql.			600	IN	A	172.23.0.2

   ;; Query time: 0 msec
   ;; SERVER: 127.0.0.11#53(127.0.0.11)
   ;; WHEN: Tue Oct 01 23:47:24 UTC 2019
   ;; MSG SIZE  rcvd: 44
   ```

   "ANSWER SECTION"에서 `mysql`에 대한 `A` 레코드가 `172.23.0.2`로 해석되는 것을 볼 수 있습니다(귀하의 IP 주소는 다를 수 있습니다). `mysql`은 일반적으로 유효한 호스트 이름이 아니지만, Docker는 네트워크 별칭을 가진 컨테이너의 IP 주소로 해석할 수 있었습니다. 이전에 `--network-alias`를 사용한 것을 기억하십시오.

   이는 애플리케이션이 `mysql`이라는 호스트 이름에 연결하기만 하면 데이터베이스와 통신할 수 있음을 의미합니다.

## MySQL과 함께 애플리케이션 실행 {#run-your-app-with-mysql}

todo 앱은 MySQL 연결 설정을 지정하기 위해 몇 가지 환경 변수를 설정할 수 있습니다. 이들은 다음과 같습니다:

- `MYSQL_HOST` - 실행 중인 MySQL 서버의 호스트 이름
- `MYSQL_USER` - 연결에 사용할 사용자 이름
- `MYSQL_PASSWORD` - 연결에 사용할 비밀번호
- `MYSQL_DB` - 연결 후 사용할 데이터베이스

:::note
개발 중에 연결 설정을 설정하기 위해 환경 변수를 사용하는 것은 일반적으로 받아들여지지만, 프로덕션에서 애플리케이션을 실행할 때는 매우 권장되지 않습니다. Docker의 전 보안 책임자인 Diogo Monica는 [훌륭한 블로그 게시물](https://diogomonica.com/2017/03/27/why-you-shouldnt-use-env-variables-for-secret-data/)을 작성하여 그 이유를 설명했습니다.

더 안전한 메커니즘은 컨테이너 오케스트레이션 프레임워크에서 제공하는 비밀 지원을 사용하는 것입니다. 대부분의 경우, 이러한 비밀은 실행 중인 컨테이너에 파일로 마운트됩니다. 많은 앱(MySQL 이미지 및 todo 앱 포함)은 `_FILE` 접미사가 있는 환경 변수를 사용하여 변수를 포함하는 파일을 가리킬 수도 있습니다.

예를 들어, `MYSQL_PASSWORD_FILE` 변수를 설정하면 앱이 연결 비밀번호로 참조된 파일의 내용을 사용하게 됩니다. Docker는 이러한 환경 변수를 지원하기 위해 아무것도 하지 않습니다. 귀하의 앱은 변수를 찾아 파일 내용을 가져와야 합니다.
:::

이제 개발 준비가 된 컨테이너를 시작할 수 있습니다.

1. 이전 환경 변수를 각각 지정하고 컨테이너를 앱 네트워크에 연결합니다. 이 명령을 실행할 때 `getting-started-app` 디렉토리에 있는지 확인하십시오.

<Tabs>
  <TabItem value="mac-linux" label="Mac / Linux">
    ```bash
    docker run -dp 127.0.0.1:3000:3000 \
      -w /app -v "$(pwd):/app" \
      --network todo-app \
      -e MYSQL_HOST=mysql \
      -e MYSQL_USER=root \
      -e MYSQL_PASSWORD=secret \
      -e MYSQL_DB=todos \
      node:18-alpine \
      sh -c "yarn install && yarn run dev"
    ```
  </TabItem>

  <TabItem value="powershell" label="PowerShell">
    Windows에서는 이 명령을 PowerShell에서 실행합니다.

    ```powershell
    docker run -dp 127.0.0.1:3000:3000 `
      -w /app -v "$(pwd):/app" `
      --network todo-app `
      -e MYSQL_HOST=mysql `
      -e MYSQL_USER=root `
      -e MYSQL_PASSWORD=secret `
      -e MYSQL_DB=todos `
      node:18-alpine `
      sh -c "yarn install && yarn run dev"
    ```

  </TabItem>

  <TabItem value="command-prompt" label="Command Prompt">
    Windows에서는 이 명령을 Command Prompt에서 실행합니다.

    ```cmd
    docker run -dp 127.0.0.1:3000:3000 ^
      -w /app -v "%cd%:/app" ^
      --network todo-app ^
      -e MYSQL_HOST=mysql ^
      -e MYSQL_USER=root ^
      -e MYSQL_PASSWORD=secret ^
      -e MYSQL_DB=todos ^
      node:18-alpine ^
      sh -c "yarn install && yarn run dev"
    ```

  </TabItem>

  <TabItem value="git-bash" label="Git Bash">
    ```bash
    docker run -dp 127.0.0.1:3000:3000 \
      -w //app -v "/$(pwd):/app" \
      --network todo-app \
      -e MYSQL_HOST=mysql \
      -e MYSQL_USER=root \
      -e MYSQL_PASSWORD=secret \
      -e MYSQL_DB=todos \
      node:18-alpine \
      sh -c "yarn install && yarn run dev"
    ```
  </TabItem>
</Tabs>

2. 컨테이너의 로그를 확인하면(`docker logs -f <container-id>`), mysql 데이터베이스를 사용하고 있음을 나타내는 다음과 유사한 메시지가 표시되어야 합니다.

   ```bash
   $ nodemon src/index.js
   [nodemon] 2.0.20
   [nodemon] to restart at any time, enter `rs`
   [nodemon] watching dir(s): *.*
   [nodemon] starting `node src/index.js`
   Connected to mysql db at host mysql
   Listening on port 3000
   ```

3. 브라우저에서 앱을 열고 할 일 목록에 몇 가지 항목을 추가합니다.

4. mysql 데이터베이스에 연결하여 항목이 데이터베이스에 기록되고 있는지 확인합니다. 비밀번호는 `secret`입니다.

   ```bash
   $ docker exec -it <mysql-container-id> mysql -p todos
   ```

   그리고 mysql 셸에서 다음을 실행합니다:

   ```bash
   mysql> select * from todo_items;
   +--------------------------------------+--------------------+-----------+
   | id                                   | name               | completed |
   +--------------------------------------+--------------------+-----------+
   | c906ff08-60e6-44e6-8f49-ed56a0853e85 | Do amazing things! |         0 |
   | 2912a79e-8486-4bc3-a4c5-460793a575ab | Be awesome!        |         0 |
   +--------------------------------------+--------------------+-----------+
   ```

   테이블은 귀하의 항목으로 인해 다르게 보일 것입니다. 그러나 항목이 저장된 것을 볼 수 있어야 합니다.

## 요약 {#summary}

이 시점에서 이제 외부 데이터베이스에 데이터를 저장하는 애플리케이션이 있습니다. 컨테이너 네트워킹 및 DNS를 사용한 서비스 검색에 대해 조금 배웠습니다.

관련 정보:

- [docker CLI 참조](/reference/cli/docker/)
- [네트워킹 개요](/manuals/engine/network/_index.md)

## 다음 단계 {#next-steps}

이 애플리케이션을 시작하는 데 필요한 모든 작업으로 인해 약간 압도감을 느끼기 시작할 가능성이 큽니다. 네트워크를 생성하고, 컨테이너를 시작하고, 모든 환경 변수를 지정하고, 포트를 노출하는 등 많은 것을 기억해야 합니다. 이는 다른 사람에게 전달하기 어렵게 만듭니다.

다음 섹션에서는 Docker Compose에 대해 배울 것입니다. Docker Compose를 사용하면 애플리케이션 스택을 훨씬 쉽게 공유하고 다른 사람들이 단일 간단한 명령으로 스택을 시작할 수 있습니다.

<Button href="08_using_compose.md">Docker Compose 사용</Button>

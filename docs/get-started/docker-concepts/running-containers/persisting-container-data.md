---
title: 컨테이너 데이터 유지
weight: 3
keywords:
  - 개념
  - 빌드
  - 이미지
  - 컨테이너
  - 도커 데스크탑
description: 이 개념 페이지에서는 Docker에서 데이터 유지의의 중요성을 배웁니다.
aliases:
  - /guides/walkthroughs/persist-data/
  - /guides/docker-concepts/running-containers/persisting-container-data/
---

<YoutubeEmbed videoId="10_2BjqB_Ls" />

## 설명 {#Explanation}

컨테이너가 시작되면 이미지에서 제공하는 파일과 구성을 사용합니다. 각 컨테이너는 파일을 생성, 수정 및 삭제할 수 있으며 다른 컨테이너에 영향을 주지 않습니다. 컨테이너가 삭제되면 이러한 파일 변경 사항도 삭제됩니다.

이러한 컨테이너의 일시적인 특성은 훌륭하지만 데이터를 지속하려는 경우에는 도전 과제가 됩니다. 예를 들어, 데이터베이스 컨테이너를 다시 시작할 때 빈 데이터베이스로 시작하고 싶지 않을 수 있습니다. 그렇다면 파일을 어떻게 지속할 수 있을까요?

### 컨테이너 볼륨 {#Container-volumes}

볼륨은 개별 컨테이너의 수명 주기를 넘어 데이터를 지속할 수 있는 저장 메커니즘입니다. 컨테이너 내부에서 외부로의 바로 가기 또는 심볼릭 링크를 제공하는 것과 같습니다.

예를 들어, `log-data`라는 볼륨을 생성한다고 가정해 보겠습니다.

```bash
$ docker volume create log-data
```

다음 명령어로 컨테이너를 시작할 때, 볼륨이 `/logs`에 마운트(또는 연결)됩니다:

```bash
$ docker run -d -p 80:80 -v log-data:/logs docker/welcome-to-docker
```

볼륨 `log-data`가 존재하지 않으면 Docker가 자동으로 생성합니다.

컨테이너가 실행될 때 `/logs` 폴더에 쓰는 모든 파일은 컨테이너 외부의 이 볼륨에 저장됩니다. 컨테이너를 삭제하고 동일한 볼륨을 사용하는 새 컨테이너를 시작하면 파일이 그대로 유지됩니다.

> **볼륨을 사용하여 파일 공유**
>
> 동일한 볼륨을 여러 컨테이너에 연결하여 컨테이너 간에 파일을 공유할 수 있습니다. 이는 로그 집계, 데이터 파이프라인 또는 기타 이벤트 기반 애플리케이션과 같은 시나리오에서 유용할 수 있습니다.

### 볼륨 관리 {#Managing-volumes}

볼륨은 컨테이너의 수명 주기와 별도로 존재하며 사용하는 데이터 및 애플리케이션 유형에 따라 상당히 커질 수 있습니다. 다음 명령어는 볼륨을 관리하는 데 유용합니다:

- `docker volume ls` - 모든 볼륨 나열
- `docker volume rm <volume-name-or-id>` - 볼륨 제거 (볼륨이 어떤 컨테이너에도 연결되지 않은 경우에만 작동)
- `docker volume prune` - 사용되지 않는 모든 볼륨 제거

## 시도해보기 {#Try-it-out}

이 가이드에서는 Postgres 컨테이너가 생성한 데이터를 지속하기 위해 볼륨을 생성하고 사용하는 연습을 합니다. 데이터베이스가 실행될 때 `/var/lib/postgresql/data` 디렉토리에 파일을 저장합니다. 여기에 볼륨을 연결하면 데이터를 유지하면서 여러 번 컨테이너를 다시 시작할 수 있습니다.

### 볼륨 사용 {#Use-volumes}

1. Docker Desktop을 [다운로드하고 설치](/get-started/get-docker/)합니다.

2. 다음 명령어로 [Postgres 이미지](https://hub.docker.com/_/postgres)를 사용하여 컨테이너를 시작합니다:

   ```bash
   $ docker run --name=db -e POSTGRES_PASSWORD=secret -d -v postgres_data:/var/lib/postgresql/data postgres
   ```

   이 명령어는 백그라운드에서 데이터베이스를 시작하고, 비밀번호로 구성하며, PostgreSQL이 데이터베이스 파일을 지속할 디렉토리에 볼륨을 연결합니다.

3. 다음 명령어로 데이터베이스에 연결합니다:

   ```bash
   $ docker exec -ti db psql -U postgres
   ```

4. PostgreSQL 명령줄에서 다음 명령어를 실행하여 데이터베이스 테이블을 생성하고 두 개의 레코드를 삽입합니다:

   ```text
   CREATE TABLE tasks (
       id SERIAL PRIMARY KEY,
       description VARCHAR(100)
   );
   INSERT INTO tasks (description) VALUES ('Finish work'), ('Have fun');
   ```

5. PostgreSQL 명령줄에서 다음 명령어를 실행하여 데이터베이스에 데이터가 있는지 확인합니다:

   ```text
   SELECT * FROM tasks;
   ```

   다음과 같은 출력이 나타납니다:

   ```text
    id | description
   ----+-------------
     1 | Finish work
     2 | Have fun
   (2 rows)
   ```

6. 다음 명령어를 실행하여 PostgreSQL 셸에서 나갑니다:

   ```bash
   \q
   ```

7. 데이터베이스 컨테이너를 중지하고 제거합니다. 컨테이너가 삭제되었더라도 데이터는 `postgres_data` 볼륨에 지속됩니다.

   ```bash
   $ docker stop db
   $ docker rm db
   ```

8. 동일한 볼륨을 연결하여 다음 명령어로 새 컨테이너를 시작합니다:

   ```bash
   $ docker run --name=new-db -d -v postgres_data:/var/lib/postgresql/data postgres
   ```

   `POSTGRES_PASSWORD` 환경 변수가 생략된 것을 알 수 있습니다. 이는 새로운 데이터베이스를 초기화 할 때만 사용됩니다.

9. 다음 명령어를 실행하여 데이터베이스에 여전히 레코드가 있는지 확인합니다:

   ```bash
   $ docker exec -ti new-db psql -U postgres -c "SELECT * FROM tasks"
   ```

### 볼륨 내용 보기 {#View-volume-contents}

Docker Desktop 대시보드는 모든 볼륨의 내용을 보고, 볼륨을 내보내고, 가져오고, 복제할 수 있는 기능을 제공합니다.

1. Docker Desktop 대시보드를 열고 **Volumes** 보기로 이동합니다. 이 보기에서 **postgres_data** 볼륨을 볼 수 있습니다.

2. **postgres_data** 볼륨의 이름을 선택합니다.

3. **Data** 탭은 볼륨의 내용을 보여주며 파일을 탐색할 수 있는 기능을 제공합니다. 파일을 두 번 클릭하면 내용을 보고 변경할 수 있습니다.

4. 파일을 마우스 오른쪽 버튼으로 클릭하여 저장하거나 삭제할 수 있습니다.

### 볼륨 제거 {#Remove-volumes}

볼륨을 제거하기 전에 어떤 컨테이너에도 연결되지 않아야 합니다. 이전 컨테이너를 제거하지 않았다면 다음 명령어로 제거합니다 (`-f`는 먼저 컨테이너를 중지한 다음 제거합니다):

```bash
$ docker rm -f new-db
```

볼륨을 제거하는 몇 가지 방법이 있습니다:

- Docker Desktop 대시보드에서 볼륨의 **Delete Volume** 옵션을 선택합니다.
- `docker volume rm` 명령어를 사용합니다:

  ```bash
  $ docker volume rm postgres_data
  ```

- `docker volume prune` 명령어를 사용하여 사용되지 않는 모든 볼륨을 제거합니다:

  ```bash
  $ docker volume prune
  ```

## 추가 자료 {#Additional-resources}

다음 자료는 볼륨에 대해 더 많이 배우는 데 도움이 됩니다:

- [Docker에서 데이터 관리](/engine/storage)
- [볼륨](/engine/storage/volumes)
- [볼륨 마운트](/engine/containers/run/#volume-mounts)

## 다음 단계 {#Next-steps}

이제 컨테이너 데이터를 지속하는 방법을 배웠으므로 로컬 파일을 컨테이너와 공유하는 방법을 배울 차례입니다.

<Button href="sharing-local-files">로컬 파일을 컨테이너와 공유하기</Button>

---
title: DB를 유지하기
weight: 50
linkTitle: "Part 4: Persist the DB"
keywords:
  - 시작하기
  - 설정
  - 오리엔테이션
  - 빠른 시작
  - 소개
  - 개념
  - 컨테이너
  - 도커 데스크탑
description: 애플리케이션에서 DB를 유지하기
aliases:
  - /get-started/05_persisting_data/
  - /guides/workshop/05_persisting_data/
---

컨테이너를 실행할 때마다 할 일 목록이 비어 있는 것을 눈치채셨나요? 왜 그럴까요? 이 부분에서는 컨테이너가 어떻게 작동하는지 알아보겠습니다.

## 컨테이너의 파일 시스템 {#the-container's-filesystem}

컨테이너가 실행될 때, 이미지의 다양한 레이어를 파일 시스템으로 사용합니다. 각 컨테이너는 파일을 생성/업데이트/삭제할 수 있는 자체 "독립적인 작업 공간"도 갖습니다. 이러한 변경 사항은 동일한 이미지를 사용하는 다른 컨테이너에서는 보이지 않습니다.

### 실습으로 확인하기 {#see-this-in-practice}

이를 확인하기 위해 두 개의 컨테이너를 시작할 것입니다. 한 컨테이너에서 파일을 생성하고, 다른 컨테이너에서 해당 파일이 존재하는지 확인할 것입니다.

1. Alpine 컨테이너를 시작하고 새 파일을 생성합니다.

   ```bash
   $ docker run --rm alpine touch greeting.txt
   ```

   :::tip
   이미지 이름(이 경우 `alpine`) 뒤에 지정한 모든 명령은 컨테이너 내부에서 실행됩니다. 이 경우, `touch greeting.txt` 명령은 컨테이너의 파일 시스템에 `greeting.txt`라는 파일을 만듭니다.
   :::

2. 새 Alpine 컨테이너를 실행하고 `stat` 명령을 사용하여 파일이 존재하는지 확인합니다.

   ```bash
   $ docker run --rm alpine stat greeting.txt
   ```

   새 컨테이너에서 파일이 존재하지 않는다는 것을 나타내는 다음과 유사한 출력을 볼 수 있습니다.

   ```bash
   stat: can't stat 'greeting.txt': No such file or directory
   ```

첫 번째 컨테이너에서 생성된 `greeting.txt` 파일은 두 번째 컨테이너에 존재하지 않았습니다. 이는 각 컨테이너의 쓰기 가능한 "최상위 레이어"가 격리되어 있기 때문입니다. 두 컨테이너가 동일한 기본 이미지를 구성하는 동일한 하위 레이어를 공유했음에도 불구하고, 쓰기 가능한 레이어는 각 컨테이너마다 고유합니다.

## 컨테이너 볼륨 {#container-volumes}

이전 실험에서 각 컨테이너가 시작될 때마다 이미지 정의에서 시작된다는 것을 확인했습니다. 컨테이너는 파일을 생성, 업데이트 및 삭제할 수 있지만, 컨테이너를 제거하면 이러한 변경 사항은 손실됩니다. Docker는 모든 변경 사항을 해당 컨테이너로 격리합니다. 볼륨을 사용하면 이 모든 것을 변경할 수 있습니다.

[볼륨](/manuals/engine/storage/volumes.md)은 컨테이너의 특정 파일 시스템 경로를 호스트 머신으로 연결할 수 있는 기능을 제공합니다. 컨테이너에서 디렉토리를 마운트하면 해당 디렉토리의 변경 사항이 호스트 머신에서도 보입니다. 동일한 디렉토리를 컨테이너 재시작 시에도 마운트하면 동일한 파일을 볼 수 있습니다.

주요 볼륨 유형은 두 가지입니다. 결국 두 가지 모두 사용하게 되겠지만, 볼륨 마운트부터 시작하겠습니다.

## 할 일 데이터 지속시키기 {#persist-the-todo-data}

기본적으로 할 일 앱은 컨테이너의 파일 시스템에서 `/etc/todos/todo.db`에 데이터를 저장합니다. SQLite에 익숙하지 않더라도 걱정하지 마세요! SQLite는 모든 데이터를 단일 파일에 저장하는 관계형 데이터베이스입니다. 대규모 애플리케이션에는 적합하지 않지만, 작은 데모에는 적합합니다. 나중에 이를 다른 데이터베이스 엔진으로 전환하는 방법을 배우게 될 것입니다.

데이터베이스가 단일 파일이므로, 해당 파일을 호스트에 지속시키고 다음 컨테이너에서 사용할 수 있게 하면 마지막으로 중단한 곳에서 다시 시작할 수 있습니다. 볼륨을 생성하고 데이터를 저장한 디렉토리에 연결(종종 "마운트"라고 함)하면 데이터를 지속시킬 수 있습니다. 컨테이너가 `todo.db` 파일에 쓰기를 수행하면, 호스트의 볼륨에 데이터를 지속시킵니다.

앞서 언급했듯이, 볼륨 마운트를 사용할 것입니다. 볼륨 마운트를 불투명한 데이터 버킷으로 생각하세요. Docker는 디스크의 저장 위치를 포함하여 볼륨을 완전히 관리합니다. 볼륨의 이름만 기억하면 됩니다.

### 볼륨 생성 및 컨테이너 시작 {#create-a-volume-and-start-the-container}

CLI 또는 Docker Desktop의 그래픽 인터페이스를 사용하여 볼륨을 생성하고 컨테이너를 시작할 수 있습니다.

<Tabs>
  <TabItem value="cli" label="CLI">
    1. `docker volume create` 명령을 사용하여 볼륨을 생성합니다.

       ```bash
       docker volume create todo-db
       ```

    2. 지속 가능한 볼륨을 사용하지 않고 여전히 실행 중인 할 일 앱 컨테이너를 `docker rm -f <id>` 명령으로 중지하고 제거합니다.

    3. 할 일 앱 컨테이너를 시작하지만, `--mount` 옵션을 추가하여 볼륨 마운트를 지정합니다. 볼륨에 이름을 지정하고, 컨테이너의 `/etc/todos`에 마운트하여 해당 경로에 생성된 모든 파일을 캡처합니다.

       ```bash
       docker run -dp 127.0.0.1:3000:3000 --mount type=volume,src=todo-db,target=/etc/todos getting-started
       ```

    :::note
    Git Bash를 사용하는 경우, 이 명령에 대해 다른 구문을 사용해야 합니다.

    ```bash
    docker run -dp 127.0.0.1:3000:3000 --mount type=volume,src=todo-db,target=//etc/todos getting-started
    ```

    Git Bash의 구문 차이에 대한 자세한 내용은 [Git Bash 사용하기](/desktop/troubleshoot-and-support/troubleshoot/topics/#working-with-git-bash)를 참조하세요.
    :::

  </TabItem>

  <TabItem value="docker-desktop" label="Docker Desktop">
  
    볼륨을 생성하려면:

    1. Docker Desktop에서 **Volumes**를 선택합니다.
    2. **Volumes**에서 **Create**를 선택합니다.
    3. 볼륨 이름으로 `todo-db`를 지정한 후 **Create**를 선택합니다.

    앱 컨테이너를 중지하고 제거하려면:

    1. Docker Desktop에서 **Containers**를 선택합니다.
    2. 컨테이너의 **Actions** 열에서 **Delete**를 선택합니다.

    볼륨이 마운트된 상태로 할 일 앱 컨테이너를 시작하려면:

    1. Docker Desktop 상단의 검색 상자를 선택합니다.
    2. 검색 창에서 **Images** 탭을 선택합니다.
    3. 검색 상자에 이미지 이름 `getting-started`를 지정합니다.

       :::tip
       검색 필터를 사용하여 이미지를 필터링하고 **Local images**만 표시합니다.
       :::

    4. 이미지를 선택한 후 **Run**을 선택합니다.
    5. **Optional settings**를 선택합니다.
    6. **Host port**에 포트 번호를 지정합니다. 예를 들어, `3000`.
    7. **Host path**에 볼륨 이름 `todo-db`를 지정합니다.
    8. **Container path**에 `/etc/todos`를 지정합니다.
    9. **Run**을 선택합니다.

  </TabItem>
</Tabs>

### 데이터 지속성 확인 {#verify-that-the-data-persists}

1. 컨테이너가 시작되면 앱을 열고 할 일 목록에 몇 가지 항목을 추가합니다.

   ![할 일 목록에 항목 추가됨](images/items-added.webp)

2. 할 일 앱 컨테이너를 중지하고 제거합니다. Docker Desktop 또는 `docker ps`를 사용하여 ID를 얻은 다음 `docker rm -f <id>`를 사용하여 제거합니다.

3. 이전 단계를 사용하여 새 컨테이너를 시작합니다.

4. 앱을 엽니다. 목록에 항목이 여전히 표시되어야 합니다.

5. 목록을 확인한 후 컨테이너를 제거합니다.

이제 데이터를 지속시키는 방법을 배웠습니다.

## 볼륨 자세히 알아보기 {#dive-into-the-volume}

많은 사람들이 "볼륨을 사용할 때 Docker가 내 데이터를 어디에 저장하나요?"라고 자주 묻습니다. 알고 싶다면, `docker volume inspect` 명령을 사용할 수 있습니다.

```bash
$ docker volume inspect todo-db
```

다음과 같은 출력을 볼 수 있습니다:

```bash
[
    {
        "CreatedAt": "2019-09-26T02:18:36Z",
        "Driver": "local",
        "Labels": {},
        "Mountpoint": "/var/lib/docker/volumes/todo-db/_data",
        "Name": "todo-db",
        "Options": {},
        "Scope": "local"
    }
]
```

`Mountpoint`는 디스크에서 데이터의 실제 위치입니다. 대부분의 머신에서는 호스트에서 이 디렉토리에 접근하려면 루트 권한이 필요합니다.

## 요약 {#summary}

이 섹션에서는 컨테이너 데이터를 지속시키는 방법을 배웠습니다.

관련 정보:

- [docker CLI 참조](/reference/cli/docker/)
- [볼륨](/manuals/engine/storage/volumes.md)

## 다음 단계 {#next-steps}

다음으로, 바인드 마운트를 사용하여 앱을 더 효율적으로 개발하는 방법을 배울 것입니다.

<Button href="06_bind_mounts.md">바인드 마운트 사용하기</Button>

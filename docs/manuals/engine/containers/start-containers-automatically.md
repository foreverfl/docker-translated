---
description: 컨테이너를 자동으로 시작하는 방법
keywords:
  - 컨테이너
  - 재시작
  - 정책
  - 자동화
  - 관리
title: 컨테이너 자동 시작
weight: 10
aliases:
  - /engine/articles/host_integration/
  - /engine/admin/host_integration/
  - /engine/admin/start-containers-automatically/
  - /config/containers/start-containers-automatically/
---

Docker는 컨테이너가 종료되거나 Docker가 재시작될 때 자동으로 시작할지 여부를 제어하는 [재시작 정책](/manuals/engine/containers/run.md#restart-policies---restart)을 제공합니다. 재시작 정책은 연결된 컨테이너를 올바른 순서로 시작합니다. Docker는 재시작 정책을 사용할 것을 권장하며, 프로세스 관리자를 사용하여 컨테이너를 시작하는 것을 피해야 합니다.

재시작 정책은 `dockerd` 명령의 `--live-restore` 플래그와 다릅니다. `--live-restore`를 사용하면 Docker 업그레이드 중에도 컨테이너를 계속 실행할 수 있지만, 네트워킹 및 사용자 입력은 중단됩니다.

## 재시작 정책 사용 {#use-a-restart-policy}

컨테이너의 재시작 정책을 구성하려면 `docker run` 명령을 사용할 때 `--restart` 플래그를 사용하십시오. `--restart` 플래그의 값은 다음 중 하나일 수 있습니다:

| 플래그                     | 설명                                                                                                                                                                                                                                                                                                                          |
| :------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `no`                       | 컨테이너를 자동으로 재시작하지 않습니다. (기본값)                                                                                                                                                                                                                                                                             |
| `on-failure[:max-retries]` | 오류로 인해 종료된 경우 컨테이너를 재시작합니다. 이는 비정상 종료 코드로 나타납니다. 선택적으로, `:max-retries` 옵션을 사용하여 Docker 데몬이 컨테이너를 재시작하려는 시도를 제한할 수 있습니다. `on-failure` 정책은 컨테이너가 실패로 종료된 경우에만 재시작을 유도합니다. 데몬이 재시작되면 컨테이너를 재시작하지 않습니다. |
| `always`                   | 컨테이너가 중지되면 항상 재시작합니다. 수동으로 중지된 경우, Docker 데몬이 재시작되거나 컨테이너 자체가 수동으로 재시작될 때만 재시작됩니다. (재시작 정책 세부 사항의 두 번째 항목 참조)                                                                                                                                      |
| `unless-stopped`           | `always`와 유사하지만, 수동 또는 기타 방법으로 컨테이너가 중지된 경우, Docker 데몬이 재시작된 후에도 재시작되지 않습니다.                                                                                                                                                                                                     |

다음 명령은 Redis 컨테이너를 시작하고 컨테이너가 명시적으로 중지되거나 데몬이 재시작되지 않는 한 항상 재시작되도록 구성합니다.

```bash
$ docker run -d --restart unless-stopped redis
```

다음 명령은 이미 실행 중인 `redis`라는 이름의 컨테이너의 재시작 정책을 변경합니다.

```bash
$ docker update --restart unless-stopped redis
```

다음 명령은 모든 실행 중인 컨테이너가 재시작되도록 보장합니다.

```bash
$ docker update --restart unless-stopped $(docker ps -q)
```

### 재시작 정책 세부 사항 {#restart-policy-details}

재시작 정책을 사용할 때 다음 사항을 유의하십시오:

- 재시작 정책은 컨테이너가 성공적으로 시작된 후에만 적용됩니다. 이 경우, 성공적으로 시작된다는 것은 컨테이너가 최소 10초 동안 실행되고 Docker가 이를 모니터링하기 시작했음을 의미합니다. 이는 전혀 시작되지 않는 컨테이너가 재시작 루프에 빠지는 것을 방지합니다.

- 컨테이너를 수동으로 중지하면 Docker 데몬이 재시작되거나 컨테이너가 수동으로 재시작될 때까지 재시작 정책이 무시됩니다. 이는 재시작 루프를 방지합니다.

- 재시작 정책은 컨테이너에만 적용됩니다. Swarm 서비스에 대한 재시작 정책을 구성하려면 [서비스 재시작 관련 플래그](/reference/cli/docker/service/create.md)를 참조하십시오.

### 포그라운드 컨테이너 재시작 {#restarting-foreground-containers}

컨테이너를 포그라운드에서 실행할 때, 컨테이너를 중지하면 컨테이너의 재시작 정책에 관계없이 연결된 CLI도 종료됩니다. 이 동작은 다음 예제에서 설명됩니다.

1. 숫자 1에서 5를 출력한 후 종료하는 Dockerfile을 만듭니다.

   ```dockerfile
   FROM busybox:latest
   COPY --chmod=755 <<"EOF" /start.sh
   echo "Starting..."
   for i in $(seq 1 5); do
     echo "$i"
     sleep 1
   done
   echo "Exiting..."
   exit 1
   EOF
   ENTRYPOINT /start.sh
   ```

2. Dockerfile에서 이미지를 빌드합니다.

   ```bash
   $ docker build -t startstop .
   ```

3. 재시작 정책으로 `always`를 지정하여 이미지에서 컨테이너를 실행합니다.

   컨테이너는 숫자 1..5를 stdout에 출력한 후 종료됩니다. 이는 연결된 CLI도 종료시킵니다.

   ```bash
   $ docker run --restart always startstop
   Starting...
   1
   2
   3
   4
   5
   Exiting...
   $
   ```

4. `docker ps`를 실행하면 재시작 정책 덕분에 컨테이너가 여전히 실행 중이거나 재시작 중임을 알 수 있습니다. 그러나 CLI 세션은 이미 종료되었습니다. 초기 컨테이너 종료 후에는 생존하지 않습니다.

   ```bash
   $ docker ps
   CONTAINER ID   IMAGE       COMMAND                  CREATED         STATUS         PORTS     NAMES
   081991b35afe   startstop   "/bin/sh -c /start.sh"   9 seconds ago   Up 4 seconds             gallant_easley
   ```

5. `docker container attach` 명령을 사용하여 재시작 사이에 터미널을 컨테이너에 다시 연결할 수 있습니다. 컨테이너가 다음에 종료될 때 다시 분리됩니다.

   ```bash
   $ docker container attach 081991b35afe
   4
   5
   Exiting...
   $
   ```

## 프로세스 관리자 사용 {#use-a-process-manager}

재시작 정책이 필요에 맞지 않는 경우, 예를 들어 Docker 컨테이너에 의존하는 프로세스가 Docker 외부에 있는 경우, [systemd](https://systemd.io/) 또는 [supervisor](http://supervisord.org/)와 같은 프로세스 관리자를 사용할 수 있습니다.

:::warning
Docker 재시작 정책과 호스트 수준의 프로세스 관리자를 결합하지 마십시오. 이는 충돌을 일으킵니다.
:::

프로세스 관리자를 사용하려면 컨테이너 또는 서비스를 수동으로 시작할 때 사용하는 것과 동일한 `docker start` 또는 `docker service` 명령을 사용하여 시작하도록 구성하십시오. 특정 프로세스 관리자에 대한 자세한 내용은 해당 문서를 참조하십시오.

### 컨테이너 내부에서 프로세스 관리자 사용 {#using-a-process-manager-inside-containers}

프로세스 관리자는 컨테이너 내부에서도 실행되어 프로세스가 실행 중인지 확인하고 실행되지 않는 경우 시작/재시작할 수 있습니다.

:::warning
이는 Docker를 인식하지 못하며, 컨테이너 내의 운영 체제 프로세스만 모니터링합니다. Docker는 이 접근 방식을 권장하지 않습니다. 이는 플랫폼에 따라 다르며 특정 Linux 배포판의 버전에 따라 다를 수 있습니다.
:::

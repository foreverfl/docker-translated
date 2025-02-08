---
title: Compose와 함께 라이프사이클 훅 사용하기
linkTitle: 라이프사이클 훅 사용하기
weight: 20
desription: Docker Compose에서 라이프사이클 훅을 사용하는 방법
keywords:
  - cli
  - compose
  - 라이프사이클
  - 훅 참조
---

## 서비스 라이프사이클 훅 {#services-lifecycle-hooks}

Docker Compose가 컨테이너를 실행할 때, 컨테이너가 시작되고 중지될 때 발생하는 일을 관리하기 위해
[ENTRYPOINT와 COMMAND](https://github.com/manuals//engine/containers/run.md#default-command-and-options) 두 가지 요소를 사용합니다.

그러나 때로는 이러한 작업을 라이프사이클 훅과 함께 별도로 처리하는 것이 더 쉬울 수 있습니다. 컨테이너가 시작된 직후 또는 중지되기 직전에 실행되는 명령입니다.

라이프사이클 훅은 특히 유용합니다. 왜냐하면 컨테이너 자체가 보안을 위해 낮은 권한으로 실행될 때에도
특별한 권한(예: 루트 사용자로 실행)을 가질 수 있기 때문입니다. 이는 더 높은 권한이 필요한 특정 작업을
컨테이너의 전체 보안을 손상시키지 않고 수행할 수 있음을 의미합니다.

### 시작 후 훅 {#post-start-hooks}

시작 후 훅은 컨테이너가 시작된 후 실행되는 명령이지만, 정확히 언제 실행될지는 정해져 있지 않습니다.
훅 실행 타이밍은 컨테이너의 `entrypoint` 실행 중 보장되지 않습니다.

제공된 예제에서:

- 훅은 볼륨의 소유권을 비루트 사용자로 변경하는 데 사용됩니다 참고로, 볼륨은 기본적으로 루트 소유권으로 생성됩니다.
- 컨테이너가 시작된 후, `chown` 명령은 `/data` 디렉토리의 소유권을 사용자 `1001`로 변경합니다.

```yaml
services:
  app:
    image: backend
    user: 1001
    volumes:
      - data:/data
    post_start:
      - command: chown -R /data 1001:1001
        user: root

volumes:
  data: {} # Docker 볼륨은 루트 소유권으로 생성됩니다
```

### 중지 전 훅 {#pre-stop-hooks}

중지 전 훅은 특정 명령(예: `docker compose down` 또는 수동으로 `Ctrl+C`로 중지하는 경우)에 의해 컨테이너가 중지되기 전에 실행되는 명령입니다.
이 훅은 컨테이너가 스스로 중지되거나 갑자기 종료되는 경우에는 실행되지 않습니다.

다음 예제에서, 컨테이너가 중지되기 전에 `./data_flush.sh` 스크립트가 실행되어 필요한 정리 작업을 수행합니다.

```yaml
services:
  app:
    image: backend
    pre_stop:
      - command: ./data_flush.sh
```

## 참조 정보 {#reference-information}

- [`post_start`](/reference/compose-file/services.md#post_start)
- [`pre_stop`](/reference/compose-file/services.md#pre_stop)

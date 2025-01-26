---
description: 단일 컨테이너에서 여러 프로세스를 실행하는 방법을 배웁니다
keywords:
  - 도커
  - 슈퍼바이저
  - 프로세스 관리
title: 컨테이너에서 여러 프로세스 실행
weight: 20
aliases:
  - /articles/using_supervisord/
  - /engine/admin/multi-service_container/
  - /engine/admin/using_supervisord/
  - /engine/articles/using_supervisord/
  - /config/containers/multi-service_container/
---

컨테이너의 주요 실행 프로세스는 `Dockerfile`의 끝에 있는 `ENTRYPOINT` 및/또는 `CMD`입니다.
최선의 방법은 관심 영역을 분리하여 컨테이너당 하나의 서비스를 사용하는 것입니다.
그 서비스는 여러 프로세스로 포크될 수 있습니다(예: Apache 웹 서버는 여러 작업자 프로세스를 시작합니다).
여러 프로세스를 갖는 것은 괜찮지만, Docker의 최대 이점을 얻으려면 하나의 컨테이너가 전체 애플리케이션의 여러 측면을 책임지지 않도록 해야 합니다.
사용자 정의 네트워크와 공유 볼륨을 사용하여 여러 컨테이너를 연결할 수 있습니다.

컨테이너의 주요 프로세스는 시작한 모든 프로세스를 관리할 책임이 있습니다.
일부 경우에는 주요 프로세스가 잘 설계되지 않아 컨테이너가 종료될 때 자식 프로세스를 "수확"(중지)하는 것을 제대로 처리하지 못합니다.
프로세스가 이 범주에 속하는 경우 컨테이너를 실행할 때 `--init` 옵션을 사용할 수 있습니다.
`--init` 플래그는 컨테이너의 주요 프로세스로 작은 초기화 프로세스를 삽입하고, 컨테이너가 종료될 때 모든 프로세스를 수확하는 역할을 합니다.
이러한 프로세스를 처리하는 방법은 컨테이너 내에서 프로세스 수명 주기를 처리하기 위해 `sysvinit` 또는 `systemd`와 같은 완전한 초기화 프로세스를 사용하는 것보다 우수합니다.

컨테이너 내에서 둘 이상의 서비스를 실행해야 하는 경우 몇 가지 방법으로 이를 달성할 수 있습니다.

## 래퍼 스크립트 사용 {#use-a-wrapper-script}

모든 명령을 래퍼 스크립트에 넣고 테스트 및 디버깅 정보를 포함합니다.
래퍼 스크립트를 `CMD`로 실행합니다. 다음은 단순한 예입니다. 먼저 래퍼 스크립트:

```bash
#!/bin/bash

# 첫 번째 프로세스 시작
./my_first_process &

# 두 번째 프로세스 시작
./my_second_process &

# 어떤 프로세스가 종료될 때까지 대기
wait -n

# 먼저 종료된 프로세스의 상태로 종료
exit $?
```

다음은 Dockerfile입니다:

```dockerfile
# syntax=docker/dockerfile:1
FROM ubuntu:latest
COPY my_first_process my_first_process
COPY my_second_process my_second_process
COPY my_wrapper_script.sh my_wrapper_script.sh
CMD ./my_wrapper_script.sh
```

## Bash 작업 제어 사용 {#use-bash-job-controls}

먼저 시작하고 실행 상태를 유지해야 하는 주요 프로세스가 있지만 일시적으로 다른 프로세스를 실행해야 하는 경우(예: 주요 프로세스와 상호 작용하기 위해) bash의 작업 제어를 사용할 수 있습니다. 먼저 래퍼 스크립트:

```bash
#!/bin/bash

# bash의 작업 제어 켜기
set -m

# 주요 프로세스를 시작하고 백그라운드로 이동
./my_main_process &

# 도우미 프로세스 시작
./my_helper_process

# my_helper_process는 주요 프로세스가 시작될 때까지 기다리는 방법을 알아야 할 수 있습니다.
# 그런 다음 작업을 수행하고 반환합니다.

# 이제 주요 프로세스를 다시 포그라운드로 가져와서
# 거기에 남겨둡니다.
fg %1
```

```dockerfile
# syntax=docker/dockerfile:1
FROM ubuntu:latest
COPY my_main_process my_main_process
COPY my_helper_process my_helper_process
COPY my_wrapper_script.sh my_wrapper_script.sh
CMD ./my_wrapper_script.sh
```

## 프로세스 관리자 사용 {#use-a-process-manager}

`supervisord`와 같은 프로세스 관리자를 사용합니다.
이는 다른 옵션보다 더 복잡하며, `supervisord`와 그 구성을 이미지에 번들로 묶거나 `supervisord`를 포함하는 이미지를 기반으로 해야 하며, 관리하는 다양한 애플리케이션도 포함해야 합니다.
그런 다음 `supervisord`를 시작하여 프로세스를 관리합니다.

다음 Dockerfile 예제는 이 접근 방식을 보여줍니다.
예제는 다음 파일이 빌드 컨텍스트의 루트에 존재한다고 가정합니다:

- `supervisord.conf`
- `my_first_process`
- `my_second_process`

```dockerfile
# syntax=docker/dockerfile:1
FROM ubuntu:latest
RUN apt-get update && apt-get install -y supervisor
RUN mkdir -p /var/log/supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY my_first_process my_first_process
COPY my_second_process my_second_process
CMD ["/usr/bin/supervisord"]
```

두 프로세스 모두 `stdout` 및 `stderr`를 컨테이너 로그에 출력하도록 하려면 `supervisord.conf` 파일에 다음을 추가할 수 있습니다:

```ini
[supervisord]
nodaemon=true
logfile=/dev/null
logfile_maxbytes=0

[program:app]
stdout_logfile=/dev/fd/1
stdout_logfile_maxbytes=0
redirect_stderr=true
```

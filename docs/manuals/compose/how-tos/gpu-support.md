---
description: Docker Compose에서 GPU 지원 이해하기
keywords:
  - 문서
  - 도큐멘트
  - 도커
  - 컴포즈
  - GPU 접근
  - NVIDIA
  - 샘플
title: Docker Compose로 GPU 접근 활성화
linkTitle: GPU 지원 활성화
weight: 90
aliases:
  - /compose/gpu-support/
---

Compose 서비스는 Docker 호스트에 GPU 장치가 있고 Docker Daemon이 적절히 설정된 경우 GPU를 사용할 수 있도록 설정할 수 있습니다. 이를 위해 [먼저 필요한 패키지와 설정](/manuals/engine/containers/resource_constraints.md#gpu)을 먼저 완료해야 합니다.

다음 섹션의 예제는 Docker Compose를 사용하여 서비스 컨테이너가 GPU에 접근할 수 있도록 구성하는 방법을 중점적으로 다룹니다.
`docker-compose` 또는 `docker compose` 명령을 사용할 수 있습니다. 자세한 내용은 [Compose V2로 마이그레이션](/manuals/compose/releases/migrate.md)을 참조하십시오.

## 서비스 컨테이너에 GPU 접근 활성화 {#enabling-gpu-access-to-service-containers}

GPU는 Compose Deploy 사양의 [device](/reference/compose-file/deploy.md#devices) 속성을 사용하여 `compose.yml` 파일에서 참조됩니다. 이 속성은 GPU가 필요한 서비스 내에서 사용됩니다.

이 속성은 다음 장치 속성에 대해 사용자 정의 값을 설정할 수 있으므로 GPU 예약에 대한 더 세밀한 제어를 제공합니다:

- `capabilities`. 이 값은 문자열 목록으로 지정됩니다 (예: `capabilities: [gpu]`). 이 필드는 Compose 파일에 설정해야 합니다. 그렇지 않으면 서비스 배포 시 오류가 반환됩니다.
- `count`. 이 값은 정수 또는 `all` 값으로 지정되며, 예약해야 하는 GPU 장치의 수를 나타냅니다 (호스트에 해당 수의 GPU가 있는 경우). `count`가 `all`로 설정되거나 지정되지 않은 경우, 기본적으로 호스트에서 사용 가능한 모든 GPU가 사용됩니다.
- `device_ids`. 이 값은 문자열 목록으로 지정되며, 호스트의 GPU 장치 ID를 나타냅니다. 호스트에서 `nvidia-smi`의 출력에서 장치 ID를 찾을 수 있습니다. `device_ids`가 설정되지 않은 경우, 기본적으로 호스트에서 사용 가능한 모든 GPU가 사용됩니다.
- `driver`. 이 값은 문자열로 지정됩니다. 예: `driver: 'nvidia'`
- `options`. 드라이버 특정 옵션을 나타내는 키-값 쌍입니다.

:::important
`capabilities` 필드를 설정해야 합니다. 그렇지 않으면 서비스 배포 시 오류가 반환됩니다.

`count`와 `device_ids`는 상호 배타적입니다. 한 번에 하나의 필드만 정의해야 합니다.
:::

이 속성에 대한 자세한 내용은 [Compose Deploy 사양](/reference/compose-file/deploy.md#devices)을 참조하십시오.

### 1개의 GPU 장치에 접근하는 서비스 실행을 위한 Compose 파일 예제 {#example-of-a-compose-file-for-running-a-service-with-access-to-1-gpu-device}

```yaml
services:
  test:
    image: nvidia/cuda:12.3.1-base-ubuntu20.04
    command: nvidia-smi
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
```

Docker Compose로 실행:

```bash
$ docker compose up
Creating network "gpu_default" with the default driver
Creating gpu_test_1 ... done
Attaching to gpu_test_1
test_1  | +-----------------------------------------------------------------------------+
test_1  | | NVIDIA-SMI 450.80.02    Driver Version: 450.80.02    CUDA Version: 11.1     |
test_1  | |-------------------------------+----------------------+----------------------+
test_1  | | GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
test_1  | | Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
test_1  | |                               |                      |               MIG M. |
test_1  | |===============================+======================+======================|
test_1  | |   0  Tesla T4            On   | 00000000:00:1E.0 Off |                    0 |
test_1  | | N/A   23C    P8     9W /  70W |      0MiB / 15109MiB |      0%      Default |
test_1  | |                               |                      |                  N/A |
test_1  | +-------------------------------+----------------------+----------------------+
test_1  |
test_1  | +-----------------------------------------------------------------------------+
test_1  | | Processes:                                                                  |
test_1  | |  GPU   GI   CI        PID   Type   Process name                  GPU Memory |
test_1  | |        ID   ID                                                   Usage      |
test_1  | |=============================================================================|
test_1  | |  No running processes found                                                 |
test_1  | +-----------------------------------------------------------------------------+
gpu_test_1 exited with code 0

```

여러 GPU를 호스팅하는 머신에서는 `device_ids` 필드를 설정하여 특정 GPU 장치를 대상으로 하고 `count`를 사용하여 서비스 컨테이너에 할당된 GPU 장치 수를 제한할 수 있습니다.

각 서비스 정의에서 `count` 또는 `device_ids`를 사용할 수 있습니다. 둘 다 결합하려고 하거나 잘못된 장치 ID를 지정하거나 시스템의 GPU 수보다 높은 값을 사용하려고 하면 오류가 반환됩니다.

```bash
$ nvidia-smi
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 450.80.02    Driver Version: 450.80.02    CUDA Version: 11.0     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|                               |                      |               MIG M. |
|===============================+======================+======================|
|   0  Tesla T4            On   | 00000000:00:1B.0 Off |                    0 |
| N/A   72C    P8    12W /  70W |      0MiB / 15109MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+
|   1  Tesla T4            On   | 00000000:00:1C.0 Off |                    0 |
| N/A   67C    P8    11W /  70W |      0MiB / 15109MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+
|   2  Tesla T4            On   | 00000000:00:1D.0 Off |                    0 |
| N/A   74C    P8    12W /  70W |      0MiB / 15109MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+
|   3  Tesla T4            On   | 00000000:00:1E.0 Off |                    0 |
| N/A   62C    P8    11W /  70W |      0MiB / 15109MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+
```

## 특정 장치에 접근 {#access-specific-devices}

GPU-0 및 GPU-3 장치에만 접근을 허용하려면:

```yaml
services:
  test:
    image: tensorflow/tensorflow:latest-gpu
    command: python -c "import tensorflow as tf;tf.test.gpu_device_name()"
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              device_ids: ["0", "3"]
              capabilities: [gpu]
```

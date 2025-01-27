---
title: 도커 드라이버
description: |
  도커 드라이버는 기본 드라이버입니다.
  Docker Engine에 번들로 포함된 BuildKit을 사용합니다.
keywords:
  - 빌드
  - buildx
  - 드라이버
  - 빌더
  - 도커
aliases:
  - /build/buildx/drivers/docker/
  - /build/building/drivers/docker/
  - /build/drivers/docker/
---

Buildx 도커 드라이버는 기본 드라이버입니다. Docker Engine에 직접 내장된 BuildKit 서버
구성 요소를 사용합니다. 도커 드라이버는 별도의 설정이 필요하지 않습니다.

다른 드라이버와 달리, 도커 드라이버를 사용하는 빌더는 수동으로 생성할 수 없습니다.
Docker 컨텍스트에서 자동으로만 생성됩니다.

도커 드라이버로 빌드된 이미지는 자동으로 로컬 이미지 저장소에 로드됩니다.

## 개요 {#synopsis}

```bash
# 도커 드라이버는 기본적으로 buildx에 의해 사용됩니다
docker buildx build .
```

어떤 BuildKit 버전을 사용할지 구성하거나 도커 드라이버를 사용하는 빌더에 추가 BuildKit
매개변수를 전달하는 것은 불가능합니다. BuildKit 버전과 매개변수는 Docker Engine에 의해
내부적으로 사전 설정됩니다.

추가 구성 및 유연성이 필요하다면, [도커 컨테이너 드라이버](./docker-container.md)를
사용하는 것을 고려해보세요.

## 추가 읽기 {#further-reading}

도커 드라이버에 대한 자세한 내용은
[buildx 참조](/reference/cli/docker/buildx/create.md#driver)를 참조하세요.

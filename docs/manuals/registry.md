---
title: 레지스트리
description: Docker Hub 레지스트리 구현
keywords:
  - 레지스트리
  - 배포
  - 도커 허브
  - 사양
  - 스키마
  - API
  - 매니페스트
  - 인증
params:
  sidebar:
    group: 오픈 소스
aliases:
  - /registry/compatibility/
  - /registry/configuration/
  - /registry/deploying/
  - /registry/deprecated/
  - /registry/garbage-collection/
  - /registry/help/
  - /registry/insecure/
  - /registry/introduction/
  - /registry/notifications/
  - /registry/recipes/
  - /registry/recipes/apache/
  - /registry/recipes/nginx/
  - /registry/recipes/osx-setup-guide/
  - /registry/spec/
  - /registry/spec/api/
  - /registry/spec/auth/
  - /registry/spec/auth/jwt/
  - /registry/spec/auth/oauth/
  - /registry/spec/auth/scope/
  - /registry/spec/auth/token/
  - /registry/spec/deprecated-schema-v1/
  - /registry/spec/implementations/
  - /registry/spec/json/
  - /registry/spec/manifest-v2-1/
  - /registry/spec/manifest-v2-2/
  - /registry/spec/menu/
  - /registry/storage-drivers/
  - /registry/storage-drivers/azure/
  - /registry/storage-drivers/filesystem/
  - /registry/storage-drivers/gcs/
  - /registry/storage-drivers/inmemory/
  - /registry/storage-drivers/oss/
  - /registry/storage-drivers/s3/
  - /registry/storage-drivers/swift/
---

:::important
[더 이상 사용되지 않는 Docker 이미지 매니페스트 버전 2, 스키마 1](https://distribution.github.io/distribution/spec/deprecated-schema-v1/) 이미지를 Docker Hub에 푸시하는 기능은 2024년 11월 4일부터 더 이상 지원되지 않습니다.
:::

레지스트리, 컨테이너 이미지를 저장하고 배포하기 위한 오픈 소스 구현체는 CNCF에 기부되었습니다. 레지스트리는 이제 Distribution이라는 이름으로 불리며, 문서는 [distribution/distribution]으로 이동했습니다.

Docker Hub 레지스트리 구현은 Distribution을 기반으로 합니다. Docker Hub는 버전 1.0.1 OCI 배포 [사양]을 구현합니다. Docker Hub가 구현하는 API 프로토콜에 대한 참조 문서는 OCI 배포 사양을 참조하십시오.

## 지원되는 미디어 유형 {#supported-media-types}

Docker Hub는 다음 이미지 매니페스트 형식을 사용하여 이미지를 가져오는 것을 지원합니다:

- [OCI 이미지 매니페스트]
- [Docker 이미지 매니페스트 버전 2, 스키마 2]
- Docker 이미지 매니페스트 버전 2, 스키마 1
- Docker 이미지 매니페스트 버전 1

다음 형식의 이미지를 푸시할 수 있습니다:

- [OCI 이미지 매니페스트]
- [Docker 이미지 매니페스트 버전 2, 스키마 2]

Docker Hub는 또한 OCI 아티팩트를 지원합니다. [OCI 아티팩트]를 참조하십시오.

## 인증 {#authentication}

Docker Hub 레지스트리에 대한 인증 관련 문서는 다음을 참조하십시오:

- [토큰 인증 사양][token]
- [OAuth 2.0 토큰 인증][oauth2]
- [JWT 인증][jwt]
- [토큰 범위 및 접근][scope]

<!-- links -->

[distribution/distribution]: https://distribution.github.io/distribution/
[specification]: https://github.com/opencontainers/distribution-spec/blob/v1.0.1/spec.md
[OCI 이미지 매니페스트]: https://github.com/opencontainers/image-spec/blob/main/manifest.md
[Docker 이미지 매니페스트 버전 2, 스키마 2]: https://distribution.github.io/distribution/spec/manifest-v2-2/
[OCI 아티팩트]: /docker-hub/repos/manage/hub-images/oci-artifacts/
[oauth2]: https://distribution.github.io/distribution/spec/auth/oauth/
[jwt]: https://distribution.github.io/distribution/spec/auth/jwt/
[token]: https://distribution.github.io/distribution/spec/auth/token/
[scope]: https://distribution.github.io/distribution/spec/auth/scope/

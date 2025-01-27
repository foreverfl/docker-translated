---
title: 베이크
weight: 50
keywords:
  - 빌드
  - buildx
  - 베이크
  - buildkit
  - hcl
  - json
  - compose
aliases:
  - /build/customize/bake/
---

베이크는 실험적 기능이며, 사용자로부터의 [피드백](https://github.com/docker/buildx/issues)을 기다리고 있습니다.

베이크는 복잡한 CLI 표현을 지정하는 대신 선언적 파일을 사용하여 빌드 구성을 정의할 수 있게 해주는 Docker Buildx의 기능입니다. 또한 단일 호출로 여러 빌드를 동시에 실행할 수 있습니다.

베이크 파일은 HCL, JSON 또는 YAML 형식으로 작성할 수 있으며, YAML 형식은 Docker Compose 파일의 확장입니다. 다음은 HCL 형식의 베이크 파일 예제입니다:

```hcl
group "default" {
  targets = ["frontend", "backend"]
}

target "frontend" {
  context = "./frontend"
  dockerfile = "frontend.Dockerfile"
  args = {
    NODE_VERSION = "22"
  }
  tags = ["myapp/frontend:latest"]
}

target "backend" {
  context = "./backend"
  dockerfile = "backend.Dockerfile"
  args = {
    GO_VERSION = ""
  }
  tags = ["myapp/backend:latest"]
}
```

`group` 블록은 동시에 빌드할 수 있는 타겟 그룹을 정의합니다.
각 `target` 블록은 빌드 컨텍스트, Dockerfile 및 태그와 같은 자체 구성을 가진 빌드 타겟을 정의합니다.

위의 베이크 파일을 사용하여 빌드를 호출하려면 다음을 실행할 수 있습니다:

```bash
$ docker buildx bake
```

이는 `default` 그룹을 실행하여 `frontend` 및 `backend` 타겟을 동시에 빌드합니다.

## 시작하기 {#get-started}

베이크 시작 방법을 배우려면 [베이크 소개](./introduction.md)를 참조하세요.

---
title: Docker CLI에서 프록시 서버 사용하기
linkTitle: 프록시 설정
weight: 20
description: Docker 클라이언트 CLI에서 프록시 서버를 사용하는 방법
keywords:
  - 네트워크
  - 네트워킹
  - 프록시
  - 클라이언트
aliases:
  - /network/proxy/
---

이 페이지에서는 컨테이너의 환경 변수를 통해 Docker CLI에서 프록시를 설정하는 방법을 설명합니다.

이 페이지는 Docker Desktop에서 프록시를 설정하는 방법을 설명하지 않습니다.
자세한 내용은 [Docker Desktop에서 HTTP/HTTPS 프록시 설정](/manuals/desktop/settings-and-maintenance/settings.md#proxies)을 참조하십시오.

Docker Desktop 없이 Docker Engine을 실행 중인 경우,
[Docker 데몬에 프록시 서버 설정](/manuals/engine/daemon/proxy.md)을 참조하여 Docker 데몬(`dockerd`) 자체에 프록시 서버를 설정하는 방법을 알아보십시오.

컨테이너에서 HTTP, HTTPS 또는 FTP 프록시 서버를 사용해야 하는 경우,
다음과 같은 방법으로 설정할 수 있습니다:

- [Docker 클라이언트 설정](#configure-the-docker-client)
- [CLI를 사용하여 프록시 설정](#set-proxy-using-the-cli)

:::note
불행히도, 웹 클라이언트가 프록시 환경 변수를 처리하는 방법이나 이를 정의하는 형식에 대한 표준은 없습니다.

이러한 변수의 역사에 관심이 있다면, GitLab 팀의 이 블로그 게시물을 확인하십시오:
[We need to talk: Can we standardize NO_PROXY?](https://about.gitlab.com/blog/2021/01/27/we-need-to-talk-no-proxy/).
:::

## Docker 클라이언트 설정 {#configure-the-docker-client}

프록시 설정을 `~/.docker/config.json`에 위치한 JSON 구성 파일을 사용하여 Docker 클라이언트에 추가할 수 있습니다.
빌드 및 컨테이너는 이 파일에 지정된 구성을 사용합니다.

```json
{
  "proxies": {
    "default": {
      "httpProxy": "http://proxy.example.com:3128",
      "httpsProxy": "https://proxy.example.com:3129",
      "noProxy": "*.test.example.com,.example.org,127.0.0.0/8"
    }
  }
}
```

:::warning
프록시 설정에는 민감한 정보가 포함될 수 있습니다. 예를 들어, 일부 프록시 서버는 URL에 인증 정보를 포함해야 하거나,
주소가 회사 환경의 IP 주소나 호스트 이름을 노출할 수 있습니다.

환경 변수는 컨테이너의 구성에 평문으로 저장되며, 원격 API를 통해 검사되거나 `docker commit`을 사용할 때 이미지에 커밋될 수 있습니다.
:::

파일을 저장한 후 구성은 활성화되며, Docker를 재시작할 필요는 없습니다. 그러나 구성은 새 컨테이너와 빌드에만 적용되며, 기존 컨테이너에는 영향을 미치지 않습니다.

다음 표는 사용 가능한 구성 매개변수를 설명합니다.

| 속성         | 설명                                                               |
| :----------- | :----------------------------------------------------------------- |
| `httpProxy`  | `HTTP_PROXY` 및 `http_proxy` 환경 변수와 빌드 인수를 설정합니다.   |
| `httpsProxy` | `HTTPS_PROXY` 및 `https_proxy` 환경 변수와 빌드 인수를 설정합니다. |
| `ftpProxy`   | `FTP_PROXY` 및 `ftp_proxy` 환경 변수와 빌드 인수를 설정합니다.     |
| `noProxy`    | `NO_PROXY` 및 `no_proxy` 환경 변수와 빌드 인수를 설정합니다.       |
| `allProxy`   | `ALL_PROXY` 및 `all_proxy` 환경 변수와 빌드 인수를 설정합니다.     |

이 설정은 컨테이너의 프록시 환경 변수를 설정하는 데만 사용되며, Docker CLI나 Docker Engine 자체의 프록시 설정에는 사용되지 않습니다.
CLI 및 데몬의 프록시 설정을 구성하려면 [환경 변수](/reference/cli/docker/#environment-variables) 및
[Docker 데몬에 프록시 서버 설정](/manuals/engine/daemon/proxy.md) 섹션을 참조하십시오.

### 프록시 설정으로 컨테이너 실행 {#run-containers-with-a-proxy-configuration}

컨테이너를 시작할 때, `~/.docker/config.json`에 있는 프록시 설정을 반영하여 프록시 관련 환경 변수가 설정됩니다.

예를 들어, [이전 섹션](#configure-the-docker-client)에 표시된 예제와 같은 프록시 설정을 가정하면,
실행하는 컨테이너의 환경 변수는 다음과 같이 설정됩니다:

```bash
$ docker run --rm alpine sh -c 'env | grep -i  _PROXY'
// https_proxy=http://proxy.example.com:3129
// HTTPS_PROXY=http://proxy.example.com:3129
// http_proxy=http://proxy.example.com:3128
// HTTP_PROXY=http://proxy.example.com:3128
// no_proxy=*.test.example.com,.example.org,127.0.0.0/8
// NO_PROXY=*.test.example.com,.example.org,127.0.0.0/8
```

### 프록시 설정으로 빌드 {#build-with-a-proxy-configuration}

빌드를 호출할 때, Docker 클라이언트 구성 파일의 프록시 설정을 기반으로 프록시 관련 빌드 인수가 자동으로 미리 채워집니다.

[이전 섹션](#configure-the-docker-client)에 표시된 예제와 같은 프록시 설정을 가정하면,
빌드 중 환경 변수는 다음과 같이 설정됩니다:

```bash
$ docker build \
  --no-cache \
  --progress=plain \
  - <<EOF
FROM alpine
RUN env | grep -i _PROXY
EOF
```

```bash
#5 [2/2] RUN env | grep -i _PROXY
// #5 0.100 HTTPS_PROXY=https://proxy.example.com:3129
// #5 0.100 no_proxy=*.test.example.com,.example.org,127.0.0.0/8
// #5 0.100 NO_PROXY=*.test.example.com,.example.org,127.0.0.0/8
// #5 0.100 https_proxy=https://proxy.example.com:3129
// #5 0.100 http_proxy=http://proxy.example.com:3128
// #5 0.100 HTTP_PROXY=http://proxy.example.com:3128
// #5 DONE 0.1s
```

### 데몬별 프록시 설정 {#configure-proxy-settings-per-daemon}

`~/.docker/config.json`의 `proxies` 아래에 있는 `default` 키는 클라이언트가 연결하는 모든 데몬에 대한 프록시 설정을 구성합니다.
개별 데몬에 대한 프록시를 구성하려면, `default` 키 대신 데몬의 주소를 사용하십시오.

다음 예제는 기본 프록시 구성과 주소 `tcp://docker-daemon1.example.com`에 있는 Docker 데몬에 대한 no-proxy 재정의를 모두 구성합니다:

```json
{
  "proxies": {
    "default": {
      "httpProxy": "http://proxy.example.com:3128",
      "httpsProxy": "https://proxy.example.com:3129",
      "noProxy": "*.test.example.com,.example.org,127.0.0.0/8"
    },
    "tcp://docker-daemon1.example.com": {
      "noProxy": "*.internal.example.net"
    }
  }
}
```

## CLI를 사용하여 프록시 설정 {#set-proxy-using-the-cli}

[Docker 클라이언트 설정](#configure-the-docker-client) 대신,
`docker build` 및 `docker run` 명령을 호출할 때 명령줄에서 프록시 설정을 지정할 수 있습니다.

명령줄에서 프록시 설정은 빌드의 경우 `--build-arg` 플래그를 사용하고,
컨테이너를 실행할 때는 `--env` 플래그를 사용합니다.

```bash
$ docker build --build-arg HTTP_PROXY="http://proxy.example.com:3128" .
$ docker run --env HTTP_PROXY="http://proxy.example.com:3128" redis
```

`docker build` 명령과 함께 사용할 수 있는 모든 프록시 관련 빌드 인수 목록은
[미리 정의된 ARGs](/reference/dockerfile.md#predefined-args)를 참조하십시오.
이 프록시 값은 빌드 컨테이너에서만 사용할 수 있습니다.
빌드 출력에는 포함되지 않습니다.

## 빌드를 위한 환경 변수로서의 프록시 {#proxy-as-environment-variable-for-builds}

빌드에 대한 프록시 설정을 지정하려면 `ENV` Dockerfile 명령을 사용하지 마십시오.
대신 빌드 인수를 사용하십시오.

프록시를 위한 환경 변수를 사용하면 구성이 이미지에 포함됩니다.
프록시가 내부 프록시인 경우, 해당 이미지를 사용하여 생성된 컨테이너에서 접근할 수 없을 수 있습니다.

이미지에 프록시 설정을 포함하는 것은 보안 위험을 초래할 수 있습니다. 값에 민감한 정보가 포함될 수 있기 때문입니다.

---
datafolder: engine-cli
datafile: docker
title: docker
aliases:
  - /edge/engine/reference/commandline/
  - /engine/reference/commandline/
  - /engine/reference/commandline/docker/
  - /engine/reference/commandline/cli/
layout: cli
---

# docker

## 설명 {#description}

Docker 시스템 구성에 따라 각 `docker` 명령어 앞에 `sudo`를 붙여야 할 수도 있습니다. `docker` 명령어에 `sudo`를 사용하지 않으려면 시스템 관리자가 `docker`라는 Unix 그룹을 만들고 사용자들을 추가할 수 있습니다.

Docker 설치 또는 `sudo` 구성에 대한 자세한 내용은 운영 체제에 대한 [설치](/install/) 지침을 참조하십시오.

### 도움말 텍스트 표시 {#display-help-text}

어떤 명령어에 대한 도움말을 나열하려면 명령어 뒤에 `--help` 옵션을 추가하여 실행하십시오.

```console
$ docker run --help

Usage: docker run [OPTIONS] IMAGE [COMMAND] [ARG...]

Create and run a new container from an image

Options:
      --add-host value             Add a custom host-to-IP mapping (host:ip) (default [])
  -a, --attach value               Attach to STDIN, STDOUT or STDERR (default [])
<...>
```

### 환경 변수 {#environment-variables}

다음은 `docker` 명령어에서 지원하는 환경 변수 목록입니다:

| 변수                          | 설명                                                                                                                                                                                                                                     |
| :---------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DOCKER_API_VERSION`          | 디버깅을 위해 협상된 API 버전을 재정의합니다 (예: `1.19`)                                                                                                                                                                                |
| `DOCKER_CERT_PATH`            | 인증 키의 위치입니다. 이 변수는 `docker` CLI와 [`dockerd` 데몬](/reference/cli/dockerd/) 모두에서 사용됩니다.                                                                                                                            |
| `DOCKER_CONFIG`               | 클라이언트 구성 파일의 위치입니다.                                                                                                                                                                                                       |
| `DOCKER_CONTENT_TRUST_SERVER` | 사용할 Notary 서버의 URL입니다. 기본값은 레지스트리와 동일한 URL입니다.                                                                                                                                                                  |
| `DOCKER_CONTENT_TRUST`        | 설정 시 Docker는 이미지를 서명하고 검증하기 위해 notary를 사용합니다. 이는 build, create, pull, push, run에 대해 `--disable-content-trust=false`와 동일합니다.                                                                           |
| `DOCKER_CONTEXT`              | 사용할 `docker context`의 이름입니다 (`DOCKER_HOST` 환경 변수와 `docker context use`로 설정된 기본 컨텍스트를 재정의합니다).                                                                                                             |
| `DOCKER_CUSTOM_HEADERS`       | (실험적) 클라이언트가 보낼 [사용자 정의 HTTP 헤더](#custom-http-headers)를 구성합니다. 헤더는 `name=value` 쌍의 쉼표로 구분된 목록으로 제공되어야 합니다. 이는 구성 파일의 `HttpHeaders` 필드와 동일합니다.                              |
| `DOCKER_DEFAULT_PLATFORM`     | `--platform` 플래그를 사용하는 명령어의 기본 플랫폼입니다.                                                                                                                                                                               |
| `DOCKER_HIDE_LEGACY_COMMANDS` | 설정 시 Docker는 `docker rm` 및 `docker pull`과 같은 "레거시" 최상위 명령어를 `docker help` 출력에서 숨기고, `docker container`와 같은 개체 유형별로만 `Management commands`를 출력합니다. 이는 향후 릴리스에서 기본값이 될 수 있습니다. |
| `DOCKER_HOST`                 | 연결할 데몬 소켓입니다.                                                                                                                                                                                                                  |
| `DOCKER_TLS`                  | `docker` CLI에서 만든 연결에 대해 TLS를 활성화합니다 (`--tls` 명령어 옵션과 동일). TLS 옵션 중 하나라도 설정된 경우 TLS가 자동으로 활성화됩니다.                                                                                         |
| `DOCKER_TLS_VERIFY`           | 설정 시 Docker는 TLS를 사용하고 원격을 검증합니다. 이 변수는 `docker` CLI와 [`dockerd` 데몬](/reference/cli/dockerd/) 모두에서 사용됩니다.                                                                                               |
| `BUILDKIT_PROGRESS`           | [BuildKit 백엔드](/build/buildkit/)로 [빌드](/reference/cli/docker/image/build/)할 때 진행률 출력 유형 (`auto`, `plain`, `tty`, `rawjson`)을 설정합니다. 컨테이너 출력을 표시하려면 plain을 사용하십시오 (기본값 `auto`).                |

Docker는 Go를 사용하여 개발되었기 때문에 Go 런타임에서 사용하는 모든 환경 변수를 사용할 수 있습니다. 특히 다음 변수가 유용할 수 있습니다:

| 변수          | 설명                                                                  |
| :------------ | :-------------------------------------------------------------------- |
| `HTTP_PROXY`  | NoProxy에 의해 재정의되지 않는 한 HTTP 요청에 대한 프록시 URL입니다.  |
| `HTTPS_PROXY` | NoProxy에 의해 재정의되지 않는 한 HTTPS 요청에 대한 프록시 URL입니다. |
| `NO_PROXY`    | 프록시에서 제외해야 하는 호스트를 쉼표로 구분한 값입니다.             |

이 변수에 대한 자세한 내용은 [Go 사양](https://pkg.go.dev/golang.org/x/net/http/httpproxy#Config)을 참조하십시오.

### 옵션 유형 {#option-types}

단일 문자 명령어 옵션은 결합할 수 있으므로 `docker run -i -t --name test busybox sh` 대신 `docker run -it --name test busybox sh`를 작성할 수 있습니다.

#### 불리언 {#boolean}

불리언 옵션은 `-d=false` 형식을 취합니다. 도움말 텍스트에서 볼 수 있는 값은 해당 플래그를 지정하지 않은 경우 설정되는 기본값입니다. 불리언 플래그를 값 없이 지정하면 기본값에 관계없이 플래그가 `true`로 설정됩니다.

예를 들어, `docker run -d`를 실행하면 값이 `true`로 설정되어 컨테이너가 백그라운드에서 "분리된" 모드로 실행됩니다.

기본값이 `true`인 옵션 (예: `docker build --rm=true`)은 `false`로 명시적으로 설정하여 기본값이 아닌 값으로 설정할 수 있습니다:

```console
$ docker build --rm=false .
```

#### 다중 {#multi}

명령어 줄에서 `-a=[]`와 같은 옵션을 여러 번 지정할 수 있습니다. 예를 들어 다음 명령어에서:

```console
$ docker run -a stdin -a stdout -i -t ubuntu /bin/bash

$ docker run -a stdin -a stdout -a stderr ubuntu /bin/ls
```

때로는 `-v`와 같이 더 복잡한 값 문자열을 요구할 수 있습니다:

```console
$ docker run -v /host:/container example/mysql
```

:::note
`pty` 구현의 제한으로 인해 `-t`와 `-a stderr` 옵션을 함께 사용하지 마십시오. `pty` 모드의 모든 `stderr`는 단순히 `stdout`으로 이동합니다.
:::

#### 문자열 및 정수 {#strings-and-integers}

`--name=""`과 같은 옵션은 문자열을 기대하며 한 번만 지정할 수 있습니다. `-c=0`과 같은 옵션은 정수를 기대하며 한 번만 지정할 수 있습니다.

### 구성 파일 {#configuration-files}

기본적으로 Docker 명령어 줄은 `$HOME` 디렉토리 내의 `.docker`라는 디렉토리에 구성 파일을 저장합니다.

Docker는 구성 디렉토리의 대부분의 파일을 관리하며 수정하지 않는 것이 좋습니다. 그러나 `config.json` 파일을 수정하여 `docker` 명령어의 특정 측면을 제어할 수 있습니다.

환경 변수 또는 명령어 줄 옵션을 사용하여 `docker` 명령어 동작을 수정할 수 있습니다. 또한 `config.json` 내의 옵션을 사용하여 동일한 동작 중 일부를 수정할 수 있습니다. 환경 변수와 `--config` 플래그가 설정된 경우 플래그가 환경 변수보다 우선합니다. 명령어 줄 옵션은 환경 변수를 재정의하고 환경 변수는 `config.json` 파일에 지정한 속성을 재정의합니다.

#### `.docker` 디렉토리 변경 {#change-the-docker-directory}

다른 디렉토리를 지정하려면 `DOCKER_CONFIG` 환경 변수 또는 `--config` 명령어 줄 옵션을 사용하십시오. 둘 다 지정된 경우 `--config` 옵션이 `DOCKER_CONFIG` 환경 변수를 재정의합니다. 아래 예제는 `~/testconfigs/` 디렉토리에 있는 `config.json` 파일을 사용하여 `docker ps` 명령어를 재정의합니다.

```console
$ docker --config ~/testconfigs/ ps
```

이 플래그는 실행 중인 명령어에만 적용됩니다. 지속적인 구성을 위해 셸 (예: `~/.profile` 또는 `~/.bashrc`)에 `DOCKER_CONFIG` 환경 변수를 설정할 수 있습니다. 아래 예제는 새 디렉토리를 `HOME/newdir/.docker`로 설정합니다.

```console
$ echo export DOCKER_CONFIG=$HOME/newdir/.docker > ~/.profile
```

### Docker CLI 구성 파일 (`config.json`) 속성 {#docker-cli-configuration-file-config-json-properties}

Docker CLI 구성을 사용하여 `docker` CLI의 설정을 사용자 정의할 수 있습니다. 구성 파일은 JSON 형식을 사용하며 속성:

기본적으로 구성 파일은 `~/.docker/config.json`에 저장됩니다. 다른 위치를 사용하려면 [`.docker` 디렉토리 변경](#change-the-docker-directory) 섹션을 참조하십시오.

:::warning
구성 파일 및 `~/.docker` 구성 디렉토리 내의 다른 파일에는 프록시에 대한 인증 정보 또는 자격 증명 저장소에 따라 이미지 레지스트리에 대한 자격 증명과 같은 민감한 정보가 포함될 수 있습니다. 다른 사람과 공유하기 전에 구성 파일의 내용을 검토하고 파일을 버전 관리에 커밋하지 않도록 하십시오.
:::

#### 명령어의 기본 출력 형식 사용자 정의 {#customize-the-default-output-format-for-commands}

이 필드를 사용하여 `--format` 플래그가 제공되지 않은 경우 일부 명령어의 기본 출력 형식을 사용자 정의할 수 있습니다.

| 속성                   | 설명                                                                                                                                                                                 |
| :--------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `configFormat`         | `docker config ls` 출력의 사용자 정의 기본 형식입니다. 지원되는 형식 지정자의 목록은 [`docker config ls`](/reference/cli/docker/config/ls/#format)를 참조하십시오.                   |
| `imagesFormat`         | `docker images` / `docker image ls` 출력의 사용자 정의 기본 형식입니다. 지원되는 형식 지정자의 목록은 [`docker images`](/reference/cli/docker/image/ls/#format)를 참조하십시오.      |
| `networksFormat`       | `docker network ls` 출력의 사용자 정의 기본 형식입니다. 지원되는 형식 지정자의 목록은 [`docker network ls`](/reference/cli/docker/network/ls/#format)를 참조하십시오.                |
| `nodesFormat`          | `docker node ls` 출력의 사용자 정의 기본 형식입니다. 지원되는 형식 지정자의 목록은 [`docker node ls`](/reference/cli/docker/node/ls/#format)를 참조하십시오.                         |
| `pluginsFormat`        | `docker plugin ls` 출력의 사용자 정의 기본 형식입니다. 지원되는 형식 지정자의 목록은 [`docker plugin ls`](/reference/cli/docker/plugin/ls/#format)를 참조하십시오.                   |
| `psFormat`             | `docker ps` / `docker container ps` 출력의 사용자 정의 기본 형식입니다. 지원되는 형식 지정자의 목록은 [`docker ps`](/reference/cli/docker/container/ls/#format)를 참조하십시오.      |
| `secretFormat`         | `docker secret ls` 출력의 사용자 정의 기본 형식입니다. 지원되는 형식 지정자의 목록은 [`docker secret ls`](/reference/cli/docker/secret/ls/#format)를 참조하십시오.                   |
| `serviceInspectFormat` | `docker service inspect` 출력의 사용자 정의 기본 형식입니다. 지원되는 형식 지정자의 목록은 [`docker service inspect`](/reference/cli/docker/service/inspect/#format)를 참조하십시오. |
| `servicesFormat`       | `docker service ls` 출력의 사용자 정의 기본 형식입니다. 지원되는 형식 지정자의 목록은 [`docker service ls`](/reference/cli/docker/service/ls/#format)를 참조하십시오.                |
| `statsFormat`          | `docker stats` 출력의 사용자 정의 기본 형식입니다. 지원되는 형식 지정자의 목록은 [`docker stats`](/reference/cli/docker/container/stats/#format)를 참조하십시오.                     |
| `tasksFormat`          | `docker stack ps` 출력의 사용자 정의 기본 형식입니다. 지원되는 형식 지정자의 목록은 [`docker stack ps`](/reference/cli/docker/stack/ps/#format)를 참조하십시오.                      |
| `volumesFormat`        | `docker volume ls` 출력의 사용자 정의 기본 형식입니다. 지원되는 형식 지정자의 목록은 [`docker volume ls`](/reference/cli/docker/volume/ls/#format)를 참조하십시오.                   |

#### 사용자 정의 HTTP 헤더 {#custom-http-headers}

`HttpHeaders` 속성은 Docker 클라이언트에서 데몬으로 전송되는 모든 메시지에 포함할 헤더 세트를 지정합니다. Docker는 이러한 헤더를 해석하거나 이해하려고 하지 않으며, 단순히 메시지에 넣습니다. Docker는 이러한 헤더가 자체적으로 설정한 헤더를 변경하지 못하도록 합니다.

대안으로, v27.1 이상에서 사용할 수 있는 `DOCKER_CUSTOM_HEADERS` [환경 변수](#environment-variables)를 사용할 수 있습니다. 이 환경 변수는 실험적이며, 정확한 동작이 변경될 수 있습니다.

#### 자격 증명 저장소 옵션 {#credential-store-options}

`credsStore` 속성은 기본 자격 증명 저장소로 사용할 외부 바이너리를 지정합니다. 이 속성이 설정되면 `docker login`은 `$PATH`에 표시되는 `docker-credential-<value>` 바이너리에 자격 증명을 저장하려고 시도합니다. 이 속성이 설정되지 않은 경우 자격 증명은 CLI 구성 파일의 `auths` 속성에 저장됩니다. 자세한 내용은 [**자격 증명 저장소** 섹션을 참조하십시오](/reference/cli/docker/login/#credential-stores)

`credHelpers` 속성은 특정 레지스트리에 대한 자격 증명을 저장하고 검색할 때 `credsStore` 또는 `auths`보다 우선적으로 사용할 자격 증명 도우미 세트를 지정합니다. 이 속성이 설정된 경우 특정 레지스트리에 대한 자격 증명을 저장하거나 검색할 때 `docker-credential-<value>` 바이너리가 사용됩니다. 자세한 내용은 [**자격 증명 도우미** 섹션을 참조하십시오](/reference/cli/docker/login/#credential-helpers)

#### 컨테이너에 대한 자동 프록시 구성 {#automatic-proxy-configuration-for-containers}

`proxies` 속성은 컨테이너에 자동으로 설정할 프록시 환경 변수를 지정하고 `docker build` 중에 `--build-arg`로 설정합니다. `"default"` 프록시 세트를 구성할 수 있으며, 클라이언트가 연결하는 모든 Docker 데몬에 대해 사용됩니다. 또는 호스트 (Docker 데몬)별로 구성을 지정할 수 있습니다. 예를 들어, `https://docker-daemon1.example.com`. 각 환경에 대해 다음 속성을 설정할 수 있습니다:

| 속성         | 설명                                                                                                   |
| :----------- | :----------------------------------------------------------------------------------------------------- |
| `httpProxy`  | 컨테이너의 `HTTP_PROXY` 및 `http_proxy`의 기본값이며, `docker build`의 `--build-arg`으로 설정됩니다.   |
| `httpsProxy` | 컨테이너의 `HTTPS_PROXY` 및 `https_proxy`의 기본값이며, `docker build`의 `--build-arg`으로 설정됩니다. |
| `ftpProxy`   | 컨테이너의 `FTP_PROXY` 및 `ftp_proxy`의 기본값이며, `docker build`의 `--build-arg`으로 설정됩니다.     |
| `noProxy`    | 컨테이너의 `NO_PROXY` 및 `no_proxy`의 기본값이며, `docker build`의 `--build-arg`으로 설정됩니다.       |
| `allProxy`   | 컨테이너의 `ALL_PROXY` 및 `all_proxy`의 기본값이며, `docker build`의 `--build-arg`으로 설정됩니다.     |

이 설정은 컨테이너의 프록시 설정을 구성하는 데만 사용되며, `docker` CLI 또는 `dockerd` 데몬의 프록시 설정에는 사용되지 않습니다. CLI 및 데몬의 프록시 설정을 구성하려면 [환경 변수](#environment-variables) 및 [HTTP/HTTPS 프록시](/engine/daemon/proxy/#httphttps-proxy) 섹션을 참조하십시오.

:::warning
프록시 설정에는 인증이 필요한 경우 민감한 정보가 포함될 수 있습니다. 환경 변수는 컨테이너의 구성에 평문으로 저장되며, 원격 API를 통해 검사하거나 `docker commit`을 사용할 때 이미지에 커밋될 수 있습니다.
:::

#### 컨테이너에서 분리하기 위한 기본 키 시퀀스 {#default-key-sequence-to-detach-from-containers}

컨테이너에 연결된 후 `CTRL-p CTRL-q` 키 시퀀스를 사용하여 분리하고 실행 상태를 유지할 수 있습니다. 이 분리 키 시퀀스는 `detachKeys` 속성을 사용하여 사용자 정의할 수 있습니다. 속성에 대한 `<sequence>` 값을 지정하십시오. `<sequence>`의 형식은 다음 중 하나와 결합된 쉼표로 구분된 목록입니다:

- `a-z` (단일 소문자 알파벳 문자)
- `@` (골뱅이)
- `[` (왼쪽 대괄호)
- `\\` (두 개의 백슬래시)
- `_` (밑줄)
- `^` (캐럿)

사용자 정의는 Docker 클라이언트에서 시작된 모든 컨테이너에 적용됩니다. 사용자는 컨테이너별로 사용자 정의 또는 기본 키 시퀀스를 재정의할 수 있습니다. 이를 위해 사용자는 `docker attach`, `docker exec`, `docker run` 또는 `docker start` 명령어와 함께 `--detach-keys` 플래그를 지정합니다.

#### CLI 플러그인 옵션 {#cli-plugin-options}

`plugins` 속성은 CLI 플러그인에 특정한 설정을 포함합니다. 키는 플러그인 이름이며, 값은 해당 플러그인에 특정한 옵션의 추가 맵입니다.

#### 샘플 구성 파일 {#sample-configuration-file}

다음은 다양한 필드에 사용되는 형식을 설명하기 위한 샘플 `config.json` 파일입니다:

```json
{
  "HttpHeaders": {
    "MyHeader": "MyValue"
  },
  "psFormat": "table {{.ID}}\\t{{.Image}}\\t{{.Command}}\\t{{.Labels}}",
  "imagesFormat": "table {{.ID}}\\t{{.Repository}}\\t{{.Tag}}\\t{{.CreatedAt}}",
  "pluginsFormat": "table {{.ID}}\t{{.Name}}\t{{.Enabled}}",
  "statsFormat": "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}",
  "servicesFormat": "table {{.ID}}\t{{.Name}}\t{{.Mode}}",
  "secretFormat": "table {{.ID}}\t{{.Name}}\t{{.CreatedAt}}\t{{.UpdatedAt}}",
  "configFormat": "table {{.ID}}\t{{.Name}}\t{{.CreatedAt}}\t{{.UpdatedAt}}",
  "serviceInspectFormat": "pretty",
  "nodesFormat": "table {{.ID}}\t{{.Hostname}}\t{{.Availability}}",
  "detachKeys": "ctrl-e,e",
  "credsStore": "secretservice",
  "credHelpers": {
    "awesomereg.example.org": "hip-star",
    "unicorn.example.com": "vcbait"
  },
  "plugins": {
    "plugin1": {
      "option": "value"
    },
    "plugin2": {
      "anotheroption": "anothervalue",
      "athirdoption": "athirdvalue"
    }
  },
  "proxies": {
    "default": {
      "httpProxy": "http://user:pass@example.com:3128",
      "httpsProxy": "https://my-proxy.example.com:3129",
      "noProxy": "intra.mycorp.example.com",
      "ftpProxy": "http://user:pass@example.com:3128",
      "allProxy": "socks://example.com:1234"
    },
    "https://manager1.mycorp.example.com:2377": {
      "httpProxy": "http://user:pass@example.com:3128",
      "httpsProxy": "https://my-proxy.example.com:3129"
    }
  }
}
```

#### 실험적 기능 {#experimental-features}

실험적 기능은 향후 제품 기능에 대한 조기 액세스를 제공합니다. 이러한 기능은 테스트 및 피드백을 위해 제공되며, 릴리스 간에 경고 없이 변경되거나 향후 릴리스에서 제거될 수 있습니다.

Docker 20.10부터 실험적 CLI 기능은 기본적으로 활성화되며, 활성화하기 위한 추가 구성이 필요하지 않습니다.

#### Notary {#notary}

자체 Notary 서버와 자체 서명된 인증서 또는 내부 인증 기관을 사용하는 경우 Docker 구성 디렉토리의 `tls/<registry_url>/ca.crt`에 인증서를 배치해야 합니다.

대안으로 시스템의 루트 인증 기관 목록에 인증서를 추가하여 전역적으로 신뢰할 수 있습니다.

## 옵션 {#options}

| 옵션             | 기본값                   | 설명                                                                                                                               |
| ---------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `--config`       | `/root/.docker`          | 클라이언트 구성 파일의 위치                                                                                                        |
| `-c --context`   |                          | 데몬에 연결할 때 사용할 컨텍스트의 이름 (DOCKER_HOST 환경 변수와 `docker context use`로 설정된 기본 컨텍스트를 재정의합니다)<br /> |
| `-D --debug`     |                          | 디버그 모드 활성화                                                                                                                 |
| `--help`         |                          | 사용법 출력                                                                                                                        |
| `-H --host`      |                          | 연결할 데몬 소켓                                                                                                                   |
| `-l --log-level` | `info`                   | 로깅 수준 설정 (`debug`, `info`, `warn`, `error`, `fatal`)                                                                         |
| `--tls`          |                          | TLS 사용; --tlsverify에 의해 암시됨                                                                                                |
| `--tlscacert`    | `/root/.docker/ca.pem`   | 이 CA가 서명한 인증서만 신뢰                                                                                                       |
| `--tlscert`      | `/root/.docker/cert.pem` | TLS 인증서 파일 경로                                                                                                               |
| `--tlskey`       | `/root/.docker/key.pem`  | TLS 키 파일 경로                                                                                                                   |
| `--tlsverify`    |                          | TLS 사용 및 원격 검증                                                                                                              |

## 예제 {#examples}

### 데몬 호스트 지정 (-H, --host) {#host}

`-H`, `--host` 플래그를 사용하여 `docker` 명령어를 호출할 때 사용할 소켓을 지정할 수 있습니다. 다음 프로토콜을 사용할 수 있습니다:

| 스킴                                       | 설명                         | 예제                             |
| ------------------------------------------ | ---------------------------- | -------------------------------- |
| `unix://[<path>]`                          | Unix 소켓 (Linux 전용)       | `unix:///var/run/docker.sock`    |
| `tcp://[<IP 또는 호스트>[:port]]`          | TCP 연결                     | `tcp://174.17.0.1:2376`          |
| `ssh://[username@]<IP 또는 호스트>[:port]` | SSH 연결                     | `ssh://user@192.168.64.5`        |
| `npipe://[<name>]`                         | 명명된 파이프 (Windows 전용) | `npipe:////./pipe/docker_engine` |

`-H` 플래그를 지정하지 않고 사용자 정의 [컨텍스트](/engine/context/working-with-contexts)를 사용하지 않는 경우 명령어는 다음 기본 소켓을 사용합니다:

- macOS 및 Linux에서 `unix:///var/run/docker.sock`
- Windows에서 `npipe:////./pipe/docker_engine`

모든 명령어에 대해 `-H` 플래그를 지정하지 않고 유사한 효과를 얻으려면 [컨텍스트 생성](/reference/cli/docker/context/create/)을 하거나, 대안으로 [`DOCKER_HOST` 환경 변수](#environment-variables)를 사용할 수 있습니다.

`-H` 플래그에 대한 자세한 내용은 [데몬 소켓 옵션](/reference/cli/dockerd/#daemon-socket-option)을 참조하십시오.

#### TCP 소켓 사용 {#using-tcp-sockets}

다음 예제는 IP 주소 `174.17.0.1`을 가진 원격 데몬에 대해 TCP를 통해 `docker ps`를 호출하는 방법을 보여줍니다. 이 데몬은 포트 `2376`에서 수신 대기 중입니다:

```console
$ docker -H tcp://174.17.0.1:2376 ps
```

:::note
관례에 따라 Docker 데몬은 보안 TLS 연결에 대해 포트 `2376`을 사용하고, 비보안 비-TLS 연결에 대해 포트 `2375`를 사용합니다.
:::

#### SSH 소켓 사용 {#using-ssh-sockets}

SSH를 사용하여 원격 데몬에서 명령어를 호출할 때 요청은 SSH 호스트의 `/var/run/docker.sock` Unix 소켓으로 전달됩니다.

```console
$ docker -H ssh://user@192.168.64.5 ps
```

소켓의 위치를 SSH 주소 끝에 경로 구성 요소를 추가하여 선택적으로 지정할 수 있습니다.

```console
$ docker -H ssh://user@192.168.64.5/var/run/docker.sock ps
```

## 하위 명령어 {#subcommands}

| 명령어                       | 설명                                                                                   |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| `docker build` (레거시 빌더) | Dockerfile에서 이미지를 빌드합니다                                                     |
| `docker builder`             | 빌드 관리                                                                              |
| `docker buildx`              | Docker Buildx                                                                          |
| `docker checkpoint`          | 체크포인트 관리                                                                        |
| `docker compose`             | Docker Compose                                                                         |
| `docker config`              | Swarm 구성 관리                                                                        |
| `docker container`           | 컨테이너 관리                                                                          |
| `docker context`             | 컨텍스트 관리                                                                          |
| `docker debug`               | 모든 컨테이너 또는 이미지에 셸을 얻습니다. `docker exec`을 사용한 디버깅의 대안입니다. |
| `docker desktop` (베타)      | Docker Desktop                                                                         |
| `docker image`               | 이미지 관리                                                                            |
| `docker init`                | 프로젝트에 대한 Docker 관련 시작 파일을 생성합니다                                     |
| `docker inspect`             | Docker 객체에 대한 저수준 정보를 반환합니다                                            |
| `docker login`               | 레지스트리에 인증                                                                      |
| `docker logout`              | 레지스트리에서 로그아웃                                                                |
| `docker manifest`            | Docker 이미지 매니페스트 및 매니페스트 목록 관리                                       |
| `docker network`             | 네트워크 관리                                                                          |
| `docker node`                | Swarm 노드 관리                                                                        |
| `docker plugin`              | 플러그인 관리                                                                          |
| `docker scout`               | Docker Scout 명령어 줄 도구                                                            |
| `docker search`              | Docker Hub에서 이미지 검색                                                             |
| `docker secret`              | Swarm 비밀 관리                                                                        |
| `docker service`             | Swarm 서비스 관리                                                                      |
| `docker stack`               | Swarm 스택 관리                                                                        |
| `docker swarm`               | Swarm 관리                                                                             |
| `docker system`              | Docker 관리                                                                            |
| `docker trust`               | Docker 이미지에 대한 신뢰 관리                                                         |
| `docker version`             | Docker 버전 정보 표시                                                                  |
| `docker volume`              | 볼륨 관리                                                                              |

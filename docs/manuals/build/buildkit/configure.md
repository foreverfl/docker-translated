---
title: BuildKit 구성
description: 빌더를 위한 BuildKit 구성 방법을 알아보세요.
keywords:
  - 빌드
  - buildkit
  - 구성
  - buildx
  - 네트워크
  - cni
  - 레지스트리
---

`docker-container` 또는 `kubernetes` 빌더를 Buildx로 생성하는 경우, `docker buildx create` 명령어에 [`--config` 플래그](/reference/cli/docker/buildx/create.md#config)를 전달하여 사용자 정의 [BuildKit 구성](toml-configuration.md)을 적용할 수 있습니다.

## 레지스트리 미러 {#registry-mirror}

빌드에 사용할 레지스트리 미러를 정의할 수 있습니다. 이렇게 하면 BuildKit이 이미지를 다른 호스트 이름에서 가져오도록 리디렉션합니다. 다음 단계는 `docker.io` (Docker Hub)를 `mirror.gcr.io`로 미러를 정의하는 예시입니다.

1. 다음 내용을 포함하여 `/etc/buildkitd.toml`에 TOML 파일을 만듭니다:

   ```toml
   debug = true
   [registry."docker.io"]
     mirrors = ["mirror.gcr.io"]
   ```

   :::note
   `debug = true`는 BuildKit 데몬에서 디버그 요청을 활성화하여 미러가 사용될 때 메시지를 기록합니다.
   :::

2. 이 BuildKit 구성을 사용하는 `docker-container` 빌더를 만듭니다:

   ```bash
   $ docker buildx create --use --bootstrap \
     --name mybuilder \
     --driver docker-container \
     --config /etc/buildkitd.toml
   ```

3. 이미지를 빌드합니다:

   ```bash
   docker buildx build --load . -f - <<EOF
   FROM alpine
   RUN echo "hello world"
   EOF
   ```

이 빌더의 BuildKit 로그는 이제 GCR 미러를 사용하고 있음을 보여줍니다. 응답 메시지에 `x-goog-*` HTTP 헤더가 포함되어 있는지 확인할 수 있습니다.

```bash
$ docker logs buildx_buildkit_mybuilder0
```

```text
...
time="2022-02-06T17:47:48Z" level=debug msg="do request" request.header.accept="application/vnd.docker.container.image.v1+json, */*" request.header.user-agent=containerd/1.5.8+unknown request.method=GET spanID=9460e5b6e64cec91 traceID=b162d3040ddf86d6614e79c66a01a577
time="2022-02-06T17:47:48Z" level=debug msg="fetch response received" response.header.accept-ranges=bytes response.header.age=1356 response.header.alt-svc="h3=\":443\"; ma=2592000,h3-29=\":443\"; ma=2592000,h3-Q050=\":443\"; ma=2592000,h3-Q046=\":443\"; ma=2592000,h3-Q043=\":443\"; ma=2592000,quic=\":443\"; ma=2592000; v=\"46,43\"" response.header.cache-control="public, max-age=3600" response.header.content-length=1469 response.header.content-type=application/octet-stream response.header.date="Sun, 06 Feb 2022 17:25:17 GMT" response.header.etag="\"774380abda8f4eae9a149e5d5d3efc83\"" response.header.expires="Sun, 06 Feb 2022 18:25:17 GMT" response.header.last-modified="Wed, 24 Nov 2021 21:07:57 GMT" response.header.server=UploadServer response.header.x-goog-generation=1637788077652182 response.header.x-goog-hash="crc32c=V3DSrg==" response.header.x-goog-hash.1="md5=d0OAq9qPTq6aFJ5dXT78gw==" response.header.x-goog-metageneration=1 response.header.x-goog-storage-class=STANDARD response.header.x-goog-stored-content-encoding=identity response.header.x-goog-stored-content-length=1469 response.header.x-guploader-uploadid=ADPycduqQipVAXc3tzXmTzKQ2gTT6CV736B2J628smtD1iDytEyiYCgvvdD8zz9BT1J1sASUq9pW_ctUyC4B-v2jvhIxnZTlKg response.status="200 OK" spanID=9460e5b6e64cec91 traceID=b162d3040ddf86d6614e79c66a01a577
time="2022-02-06T17:47:48Z" level=debug msg="fetch response received" response.header.accept-ranges=bytes response.header.age=760 response.header.alt-svc="h3=\":443\"; ma=2592000,h3-29=\":443\"; ma=2592000,h3-Q050=\":443\"; ma=2592000,h3-Q046=\":443\"; ma=2592000,h3-Q043=\":443\"; ma=2592000,quic=\":443\"; ma=2592000; v=\"46,43\"" response.header.cache-control="public, max-age=3600" response.header.content-length=1471 response.header.content-type=application/octet-stream response.header.date="Sun, 06 Feb 2022 17:35:13 GMT" response.header.etag="\"35d688bd15327daafcdb4d4395e616a8\"" response.header.expires="Sun, 06 Feb 2022 18:35:13 GMT" response.header.last-modified="Wed, 24 Nov 2021 21:07:12 GMT" response.header.server=UploadServer response.header.x-goog-generation=1637788032100793 response.header.x-goog-hash="crc32c=aWgRjA==" response.header.x-goog-hash.1="md5=NdaIvRUyfar8201DleYWqA==" response.header.x-goog-metageneration=1 response.header.x-goog-storage-class=STANDARD response.header.x-goog-stored-content-encoding=identity response.header.x-goog-stored-content-length=1471 response.header.x-guploader-uploadid=ADPycdtR-gJYwC7yHquIkJWFFG8FovDySvtmRnZBqlO3yVDanBXh_VqKYt400yhuf0XbQ3ZMB9IZV2vlcyHezn_Pu3a1SMMtiw response.status="200 OK" spanID=9460e5b6e64cec91 traceID=b162d3040ddf86d6614e79c66a01a577
time="2022-02-06T17:47:48Z" level=debug msg=fetch spanID=9460e5b6e64cec91 traceID=b162d3040ddf86d6614e79c66a01a577
time="2022-02-06T17:47:48Z" level=debug msg=fetch spanID=9460e5b6e64cec91 traceID=b162d3040ddf86d6614e79c66a01a577
time="2022-02-06T17:47:48Z" level=debug msg=fetch spanID=9460e5b6e64cec91 traceID=b162d3040ddf86d6614e79c66a01a577
time="2022-02-06T17:47:48Z" level=debug msg=fetch spanID=9460e5b6e64cec91 traceID=b162d3040ddf86d6614e79c66a01a577
time="2022-02-06T17:47:48Z" level=debug msg="do request" request.header.accept="application/vnd.docker.image.rootfs.diff.tar.gzip, */*" request.header.user-agent=containerd/1.5.8+unknown request.method=GET spanID=9460e5b6e64cec91 traceID=b162d3040ddf86d6614e79c66a01a577
time="2022-02-06T17:47:48Z" level=debug msg="fetch response received" response.header.accept-ranges=bytes response.header.age=1356 response.header.alt-svc="h3=\":443\"; ma=2592000,h3-29=\":443\"; ma=2592000,h3-Q050=\":443\"; ma=2592000,h3-Q046=\":443\"; ma=2592000,h3-Q043=\":443\"; ma=2592000,quic=\":443\"; ma=2592000; v=\"46,43\"" response.header.cache-control="public, max-age=3600" response.header.content-length=2818413 response.header.content-type=application/octet-stream response.header.date="Sun, 06 Feb 2022 17:25:17 GMT" response.header.etag="\"1d55e7be5a77c4a908ad11bc33ebea1c\"" response.header.expires="Sun, 06 Feb 2022 18:25:17 GMT" response.header.last-modified="Wed, 24 Nov 2021 21:07:06 GMT" response.header.server=UploadServer response.header.x-goog-generation=1637788026431708 response.header.x-goog-hash="crc32c=ZojF+g==" response.header.x-goog-hash.1="md5=HVXnvlp3xKkIrRG8M+vqHA==" response.header.x-goog-metageneration=1 response.header.x-goog-storage-class=STANDARD response.header.x-goog-stored-content-encoding=identity response.header.x-goog-stored-content-length=2818413 response.header.x-guploader-uploadid=ADPycdsebqxiTBJqZ0bv9zBigjFxgQydD2ESZSkKchpE0ILlN9Ibko3C5r4fJTJ4UR9ddp-UBd-2v_4eRpZ8Yo2llW_j4k8WhQ response.status="200 OK" spanID=9460e5b6e64cec91 traceID=b162d3040ddf86d6614e79c66a01a577
...
```

## 레지스트리 인증서 설정 {#setting-registry-certificates}

BuildKit 구성에서 레지스트리 인증서를 지정하면 데몬이 파일을 컨테이너의 `/etc/buildkit/certs` 아래로 복사합니다. 다음 단계는 BuildKit 구성에 자체 서명된 레지스트리 인증서를 추가하는 방법을 보여줍니다.

1. 다음 구성을 `/etc/buildkitd.toml`에 추가합니다:

   ```toml
   # /etc/buildkitd.toml
   debug = true
   [registry."myregistry.com"]
     ca=["/etc/certs/myregistry.pem"]
     [[registry."myregistry.com".keypair]]
       key="/etc/certs/myregistry_key.pem"
       cert="/etc/certs/myregistry_cert.pem"
   ```

   이는 빌더가 지정된 위치(`/etc/certs`)에 있는 인증서를 사용하여 `myregistry.com` 레지스트리에 이미지를 푸시하도록 합니다.

2. 이 구성을 사용하는 `docker-container` 빌더를 만듭니다:

   ```bash
   $ docker buildx create --use --bootstrap \
     --name mybuilder \
     --driver docker-container \
     --config /etc/buildkitd.toml
   ```

3. 빌더의 구성 파일(`/etc/buildkit/buildkitd.toml`)을 검사합니다. 인증서 구성이 빌더에 설정된 것을 확인할 수 있습니다.

   ```bash
   $ docker exec -it buildx_buildkit_mybuilder0 cat /etc/buildkit/buildkitd.toml
   ```

   ```toml
   debug = true

   [registry]

     [registry."myregistry.com"]
       ca = ["/etc/buildkit/certs/myregistry.com/myregistry.pem"]

       [[registry."myregistry.com".keypair]]
         cert = "/etc/buildkit/certs/myregistry.com/myregistry_cert.pem"]
         key = "/etc/buildkit/certs/myregistry.com/myregistry_key.pem"]
   ```

4. 컨테이너 내부에 인증서가 있는지 확인합니다:

   ```bash
   $ docker exec -it buildx_buildkit_mybuilder0 ls /etc/buildkit/certs/myregistry.com/
   myregistry.pem    myregistry_cert.pem   myregistry_key.pem
   ```

이제 이 빌더를 사용하여 레지스트리에 푸시할 수 있으며, 인증서를 사용하여 인증합니다:

```bash
$ docker buildx build --push --tag myregistry.com/myimage:latest .
```

## CNI 네트워킹 {#cni-networking}

CNI 네트워킹은 동시 빌드 중 네트워크 포트 충돌을 처리하는 데 유용할 수 있습니다. CNI는 기본 BuildKit 이미지에서 [아직](https://github.com/moby/buildkit/issues/28) 사용할 수 없습니다. 그러나 CNI 지원을 포함하는 자체 이미지를 만들 수 있습니다.

다음 Dockerfile 예제는 CNI 지원이 포함된 사용자 정의 BuildKit 이미지를 보여줍니다. 이는 BuildKit의 [통합 테스트를 위한 CNI 구성](https://github.com/moby/buildkit/blob/master//hack/fixtures/cni.json)을 예로 사용합니다. 자신의 CNI 구성을 포함할 수 있습니다.

```dockerfile
# syntax=docker/dockerfile:1

ARG BUILDKIT_VERSION=v
ARG CNI_VERSION=v1.0.1

FROM --platform=$BUILDPLATFORM alpine AS cni-plugins
RUN apk add --no-cache curl
ARG CNI_VERSION
ARG TARGETOS
ARG TARGETARCH
WORKDIR /opt/cni/bin
RUN curl -Ls https://github.com/containernetworking/plugins/releases/download/$CNI_VERSION/cni-plugins-$TARGETOS-$TARGETARCH-$CNI_VERSION.tgz | tar xzv

FROM moby/buildkit:${BUILDKIT_VERSION}
ARG BUILDKIT_VERSION
RUN apk add --no-cache iptables
COPY --from=cni-plugins /opt/cni/bin /opt/cni/bin
ADD https://raw.githubusercontent.com/moby/buildkit/${BUILDKIT_VERSION}/hack/fixtures/cni.json /etc/buildkit/cni.json
```

이제 이 이미지를 빌드하고 [`--driver-opt image` 옵션](/reference/cli/docker/buildx/create.md#driver-opt)을 사용하여 빌더 인스턴스를 만들 수 있습니다:

```bash
$ docker buildx build --tag buildkit-cni:local --load .
$ docker buildx create --use --bootstrap \
  --name mybuilder \
  --driver docker-container \
  --driver-opt "image=buildkit-cni:local" \
  --buildkitd-flags "--oci-worker-net=cni"
```

## 리소스 제한 {#resource-limiting}

### 최대 병렬 처리 {#max-parallelism}

BuildKit 솔버의 병렬 처리를 제한할 수 있습니다. 이는 특히 저전력 기계에 유용합니다. [`--config` 플래그](/reference/cli/docker/buildx/create.md#config)를 사용하여 빌더를 생성할 때 [BuildKit 구성](toml-configuration.md)을 사용합니다.

```toml
# /etc/buildkitd.toml
[worker.oci]
  max-parallelism = 4
```

이제 이 BuildKit 구성을 사용하여 병렬 처리를 제한하는 [docker-container 빌더](/manuals/build/builders/drivers/docker-container.md)를 생성할 수 있습니다.

```bash
$ docker buildx create --use \
  --name mybuilder \
  --driver docker-container \
  --config /etc/buildkitd.toml
```

### TCP 연결 제한 {#tcp-connection-limit}

TCP 연결은 이미지를 가져오고 푸시하는 동안 레지스트리당 4개의 동시 연결로 제한되며, 메타데이터 요청에 전용 연결이 추가로 하나 더 있습니다. 이 연결 제한은 이미지를 가져오는 동안 빌드가 멈추지 않도록 합니다. 전용 메타데이터 연결은 전체 빌드 시간을 줄이는 데 도움이 됩니다.

자세한 정보: [moby/buildkit#2259](https://github.com/moby/buildkit/pull/2259)

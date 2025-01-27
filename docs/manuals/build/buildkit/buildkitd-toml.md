---
title: buildkitd.toml
---

buildkitd 데몬 설정을 구성하는 데 사용되는 TOML 파일에는 전역 설정의 짧은 목록이 있으며, 그 뒤에 특정 영역의 데몬 구성을 위한 일련의 섹션이 나옵니다.

파일 경로는 rootful 모드의 경우 `/etc/buildkit/buildkitd.toml`, rootless 모드의 경우 `~/.config/buildkit/buildkitd.toml`입니다.

다음은 전체 `buildkitd.toml` 구성 예제입니다.
일부 구성 옵션은 엣지 케이스에서만 유용하다는 점에 유의하세요.

```toml
# debug는 추가 디버그 로깅을 활성화합니다.
debug = true
# trace는 추가 추적 로깅을 활성화합니다 (매우 자세하며 성능에 영향을 미칠 수 있음).
trace = true
# root는 모든 buildkit 상태가 저장되는 위치입니다.
root = "/var/lib/buildkit"
# insecure-entitlements는 기본적으로 비활성화된 비보안 권한을 허용합니다.
insecure-entitlements = [ "network.host", "security.insecure" ]

[log]
  # 로그 포맷터: json 또는 text
  format = "text"

[dns]
  nameservers=["1.1.1.1","8.8.8.8"]
  options=["edns0"]
  searchDomains=["example.com"]

[grpc]
  address = [ "tcp://0.0.0.0:1234" ]
  # debugAddress는 go 프로파일 및 디버거를 연결하기 위한 주소입니다.
  debugAddress = "0.0.0.0:6060"
  uid = 0
  gid = 0
  [grpc.tls]
    cert = "/etc/buildkit/tls.crt"
    key = "/etc/buildkit/tls.key"
    ca = "/etc/buildkit/tlsca.crt"

[otel]
  # OTEL 수집기 추적 소켓 경로
  socketPath = "/run/buildkit/otel-grpc.sock"

# 완료된 빌드 명령에 대한 정보를 저장하는 빌드 히스토리 API 구성
[history]
  # maxAge는 유지할 히스토리 항목의 최대 연령(초)입니다.
  maxAge = 172800
  # maxEntries는 유지할 히스토리 항목의 최대 수입니다.
  maxEntries = 50

[worker.oci]
  enabled = true
  # platforms는 수동으로 플랫폼을 구성하며, 설정되지 않은 경우 자동으로 감지됩니다.
  platforms = [ "linux/amd64", "linux/arm64" ]
  snapshotter = "auto" # overlayfs 또는 native, 기본값은 "auto"입니다.
  rootless = false # rootless 모드에 대한 자세한 내용은 docs/rootless.md를 참조하세요.
  # 주 PID 네임스페이스에서 하위 프로세스를 실행할지 여부, 이는 컨테이너 내에서 rootless buildkit을 실행하는 데 유용합니다.
  noProcessSandbox = false

  # gc는 가비지 수집을 활성화/비활성화합니다.
  gc = true
  # reservedSpace는 이 buildkit 작업자가 보유할 최소 디스크 공간입니다. 이 임계값 아래의 사용량은 가비지 수집 중에 회수되지 않습니다.
  # 모든 디스크 공간 매개변수는 바이트 단위의 정수(예: 512000000), 단위가 있는 문자열(예: "512MB") 또는 총 디스크 공간의 백분율(예: "10%")일 수 있습니다.
  reservedSpace = "30%"
  # maxUsedSpace는 이 buildkit 작업자가 사용할 수 있는 최대 디스크 공간입니다. 이 임계값을 초과하는 사용량은 가비지 수집 중에 회수됩니다.
  maxUsedSpace = "60%"
  # minFreeSpace는 가비지 수집기가 남기려고 시도하는 목표 여유 디스크 공간입니다. 그러나 reservedSpace 아래로는 내려가지 않습니다.
  minFreeSpace = "20GB"

  # 대체 OCI 작업자 바이너리 이름(예: 'crun'), 기본적으로 buildkit-runc 또는 runc 바이너리가 사용됩니다.
  binary = ""
  # 빌드 컨테이너를 제한하는 데 사용될 apparmor 프로필의 이름입니다. 작업자를 생성하기 전에 상위 시스템에 의해 프로필이 이미 로드되어 있어야 합니다.
  apparmor-profile = ""
  # 동시에 실행할 수 있는 병렬 빌드 단계의 수를 제한합니다.
  max-parallelism = 4
  # 네임스페이스 할당 및 해제 오버헤드를 줄이기 위해 재사용 가능한 CNI 네임스페이스 풀을 유지합니다.
  cniPoolSize = 16

  [worker.oci.labels]
    "foo" = "bar"

  [[worker.oci.gcpolicy]]
    # reservedSpace는 이 정책에 의해 보유될 최소 디스크 공간입니다. 이 임계값 아래의 사용량은 가비지 수집 중에 회수되지 않습니다.
    reservedSpace = "512MB"
    # maxUsedSpace는 이 정책에 의해 사용할 수 있는 최대 디스크 공간입니다. 이 임계값을 초과하는 사용량은 가비지 수집 중에 회수됩니다.
    maxUsedSpace = "1GB"
    # minFreeSpace는 가비지 수집기가 남기려고 시도하는 목표 여유 디스크 공간입니다. 그러나 reservedSpace 아래로는 내려가지 않습니다.
    minFreeSpace = "10GB"

    # keepDuration은 초 단위의 정수(예: 172800) 또는 문자열 기간(예: "48h")일 수 있습니다.
    keepDuration = "48h"
    filters = [ "type==source.local", "type==exec.cachemount", "type==source.git.checkout"]
  [[worker.oci.gcpolicy]]
    all = true
    reservedSpace = 1024000000

[worker.containerd]
  address = "/run/containerd/containerd.sock"
  enabled = true
  platforms = [ "linux/amd64", "linux/arm64" ]
  namespace = "buildkit"

  # gc는 가비지 수집을 활성화/비활성화합니다.
  gc = true
  # reservedSpace는 이 buildkit 작업자가 보유할 최소 디스크 공간입니다. 이 임계값 아래의 사용량은 가비지 수집 중에 회수되지 않습니다.
  # 모든 디스크 공간 매개변수는 바이트 단위의 정수(예: 512000000), 단위가 있는 문자열(예: "512MB") 또는 총 디스크 공간의 백분율(예: "10%")일 수 있습니다.
  reservedSpace = "30%"
  # maxUsedSpace는 이 buildkit 작업자가 사용할 수 있는 최대 디스크 공간입니다. 이 임계값을 초과하는 사용량은 가비지 수집 중에 회수됩니다.
  maxUsedSpace = "60%"
  # minFreeSpace는 가비지 수집기가 남기려고 시도하는 목표 여유 디스크 공간입니다. 그러나 reservedSpace 아래로는 내려가지 않습니다.
  minFreeSpace = "20GB"

  # 네임스페이스 할당 및 해제 오버헤드를 줄이기 위해 재사용 가능한 CNI 네임스페이스 풀을 유지합니다.
  cniPoolSize = 16
  # 모든 컨테이너의 상위 cgroup을 설정합니다.
  defaultCgroupParent = "buildkit"

  [worker.containerd.labels]
    "foo" = "bar"

  # containerd 런타임을 구성합니다.
  [worker.containerd.runtime]
    name = "io.containerd.runc.v2"
    path = "/path/to/containerd/runc/shim"
    options = { BinaryName = "runc" }

  [[worker.containerd.gcpolicy]]
    reservedSpace = 512000000
    keepDuration = 172800
    filters = [ "type==source.local", "type==exec.cachemount", "type==source.git.checkout"]
  [[worker.containerd.gcpolicy]]
    all = true
    reservedSpace = 1024000000

# 레지스트리는 캐시 가져오기 또는 출력에 사용되는 새로운 Docker 레지스터를 구성합니다.
[registry."docker.io"]
  # 미러 레지스트리가 /project 경로를 요구하는 경우 경로를 처리하기 위한 미러 구성
  mirrors = ["yourmirror.local:5000", "core.harbor.domain/proxy.docker.io"]
  http = true
  insecure = true
  ca=["/etc/config/myca.pem"]
  [[registry."docker.io".keypair]]
    key="/etc/config/key.pem"
    cert="/etc/config/cert.pem"

# 선택적으로 미러 구성은 레지스트리로 정의하여 수행할 수 있습니다.
[registry."yourmirror.local:5000"]
  http = true

# 프론트엔드 제어
[frontend."dockerfile.v0"]
  enabled = true

[frontend."gateway.v0"]
  enabled = true

  # allowedRepositories가 비어 있으면 모든 게이트웨이 소스가 허용됩니다.
  # 그렇지 않으면 나열된 리포지토리만 게이트웨이 소스로 허용됩니다.
  # 
  # 참고: 태그가 없는 리포지토리 이름만 비교됩니다.
  #
  # 예:
  # allowedRepositories = [ "docker-registry.wikimedia.org/repos/releng/blubber/buildkit" ]
  allowedRepositories = []

[system]
  # buildkit이 지원되는 에뮬레이트된 플랫폼의 변경 사항을 스캔하는 빈도
  platformsCacheMaxAge = "1h"

```

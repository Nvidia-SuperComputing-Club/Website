export function sudoHandler() {
  return "Nice try. You don't have root access to the GPU cluster.";
}

export function exitHandler() {
  return "You can't exit the matrix. Refresh the page instead.";
}

export function nvidiaSmiHandler() {
  return `+-----------------------------------------------------------------------------------------+
| NVIDIA-SMI 550.54.14              Driver Version: 550.54.14      CUDA Version: 12.4     |
|-----------------------------------------+------------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id          Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |           Memory-Usage | GPU-Util  Compute M. |
|                                         |                        |               MIG M. |
|=========================================+========================+======================|
|   0  NVIDIA H200 141GB              On  | 00000000:00:04.0   Off |                    0 |
| N/A   37C    P0             145W / 700W |   14100MiB / 141312MiB |     10%      Default |
|                                         |                        |                  N/A |
+-----------------------------------------+------------------------+----------------------+
|   1  NVIDIA H200 141GB              On  | 00000000:00:05.0   Off |                    0 |
| N/A   42C    P0             295W / 700W |   98500MiB / 141312MiB |     70%      Default |
|                                         |                        |                  N/A |
+-----------------------------------------+------------------------+----------------------+
|   2  NVIDIA H200 141GB              On  | 00000000:00:06.0   Off |                    0 |
| N/A   39C    P0             320W / 700W |  132000MiB / 141312MiB |     94%      Default |
|                                         |                        |                  N/A |
+-----------------------------------------+------------------------+----------------------+
|   3  NVIDIA H200 141GB              On  | 00000000:00:07.0   Off |                    0 |
| N/A   32C    P8              45W / 700W |      24MiB / 141312MiB |      0%      Default |
|                                         |                        |                  N/A |
+-----------------------------------------+------------------------+----------------------+
                                                                                         
+-----------------------------------------------------------------------------------------+
| Processes:                                                                              |
|  GPU   GI   CI        PID   Type   Process name                              GPU Memory |
|        ID   ID                                                               Usage      |
|=========================================================================================|
|    0   N/A  N/A      8413      C   python3 /train_llama_70b.py                  14080MiB |
|    1   N/A  N/A      9821      C   python3 /finetune_sdxl.py                    98450MiB |
|    2   N/A  N/A     11024      C   python3 /opt_kernel_inference.py            131950MiB |
+-----------------------------------------------------------------------------------------+`;
}

export function gpuHandler() {
  return `Evaluating GPU Cluster Health...
  
GPU 0 [NVIDIA H200]  |████████████████████| 100%  Temp: 37°C  VRAM: 14.1GB / 141GB
GPU 1 [NVIDIA H200]  |██████████████░░░░░░|  70%  Temp: 42°C  VRAM: 98.5GB / 141GB
GPU 2 [NVIDIA H200]  |███████████████████░|  94%  Temp: 39°C  VRAM: 132.0GB / 141GB
GPU 3 [NVIDIA H200]  |░░░░░░░░░░░░░░░░░░░░|   0%  Temp: 32°C  VRAM: 0.02GB / 141GB

VRAM Cluster Utilization: 244.6GB / 564.0GB (43.3%)
HBM3e Bandwidth Load:    3.2 TB/s average
All nodes healthy. Ready for supercomputing workloads.`;
}

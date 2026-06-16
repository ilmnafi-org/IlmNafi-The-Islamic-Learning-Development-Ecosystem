# Single-Point Global Load Balancing Architecture Guide

This document defines the highly scalable production load balancing strategy for **Ilm Nafi Portal** running on Google Cloud Run. 

Because Cloud Run services automatically scale horizontally from `0` to thousands of concurrent containers based on request volume, the addition of a **Global External HTTP(S) Load Balancer (GXLB)** adds high security, low latency, global SSL termination, integrated content caching (Cloud CDN), and custom vanity domains.

---

## 1. High-Availability Target Topology

```
                  [User Global Requests]
                            │
              (HTTPS - Port 443 with Managed SSL)
                            │
               [Google Global Load Balancer]
               ├── Cloud Armor Web Application Firewall
               └── Cloud CDN (Cached audio assets & web app files)
                            │
                            ▼
              [Serverless Network Endpoint Groups] (NEGs)
                            │
                    (Internal Routing)
                            │
                            ▼
         [Google Cloud Run Container Instances]
               (Auto-scaling 0 -> 1000 containers)
```

---

## 2. Infrastructure Setup Steps (CLI Guide)

To configure the proxying load balancer, you can run the following `gcloud` commands in your automation console:

### Step 1: Create a Serverless Network Endpoint Group (NEG)
Create a serverless NEG pointing to your Cloud Run container service:
```bash
gcloud compute network-endpoint-groups create ilm-nafi-serverless-neg \
    --region=us-central1 \
    --network-endpoint-type=serverless \
    --cloud-run-service=ilm-nafi-service
```

### Step 2: Set Up Backend Services and Attach the NEG
Create a global Backend Service, attach cloud-native settings, and add the serverless NEG:
```bash
# 1. Open the Backend configuration
gcloud compute backend-services create google-cloud-run-backend \
    --global \
    --load-balancing-scheme=EXTERNAL_MANAGED

# 2. Add Serverless NEG to Backend
gcloud compute backend-services add-backend google-cloud-run-backend \
    --global \
    --network-endpoint-group=ilm-nafi-serverless-neg \
    --network-endpoint-group-region=us-central1
```

### Step 3: Configure URL Maps & Core Routing Paths
Create a URL map corresponding to route paths:
```bash
gcloud compute url-maps create ilm-nafi-global-url-map \
    --default-service=google-cloud-run-backend
```

### Step 4: Configure SSL Certificates and Front-End Client Termination
Generate Google-managed SSL certificates for your custom portal domain:
```bash
# 1. Provision Certificate
gcloud compute ssl-certificates create ilm-nafi-ssl-cert \
    --domains="ilmnafi.org" --global

# 2. Create target HTTPS proxy map
gcloud compute target-https-proxies create ilm-nafi-https-proxy \
    --url-map=ilm-nafi-global-url-map \
    --ssl-certificates=ilm-nafi-ssl-cert

# 3. Open ingress IP point forwarding rules
gcloud compute forwarding-rules create ilm-nafi-forwarding-rule \
    --global \
    --target-https-proxy=ilm-nafi-https-proxy \
    --ports=443 \
    --load-balancing-scheme=EXTERNAL_MANAGED
```

---

## 3. High Performance Caching (Cloud CDN Optimization)

To reduce bandwidth strain and latency for streaming large Quran audio files, configure caching for audio files:

1. Enable **Cloud CDN** on the backend service of the Load Balancer:
   ```bash
   gcloud compute backend-services update google-cloud-run-backend \
       --global \
       --enable-cdn \
       --cache-mode=CACHE_ALL_STATIC
   ```
2. Assets matching `/api/audio-proxy` will be cached directly on Google Edge nodes.
3. This yields sub-`10ms` response times for cached surahs on repeat listens globally.

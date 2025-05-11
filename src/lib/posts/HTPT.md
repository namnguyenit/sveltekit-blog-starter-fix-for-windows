---
title: "Hệ thống phân tán"
date: "2025-04-26"
updated: "2025-05-05"
categories:
  - "sveltekit"
  - "markdown"
coverImage: "https://vnptai.io/storage/thumbnail/distributed-computing-la-gi.jpg"
coverWidth: 16
coverHeight: 9
excerpt: Check out how heading links work with this starter in this post.
---


# Hệ thống phân tán

Tài liệu này tổng hợp các câu hỏi và đáp án về **hệ thống phân tán** (Distributed Systems), bao gồm định nghĩa, ứng dụng, các khái niệm chính, giải thích các thuật ngữ quan trọng, ví dụ minh họa và các mô hình kiến trúc mới nhất.

---

## 1. Hệ thống phân tán là gì?

**Hệ thống phân tán** (Distributed System) là một tập hợp các nút (nodes) độc lập, kết nối qua mạng, phối hợp với nhau để thực hiện một mục tiêu chung. Mỗi nút có thể chạy trên máy tính riêng biệt, nhưng nhìn từ bên ngoài, toàn bộ hệ thống hoạt động như một thực thể thống nhất.

---

## 2. Ứng dụng của hệ thống phân tán

- **Web Services & Microservices**: Netflix, Spotify, Amazon…
- **Hệ thống lưu trữ dữ liệu phân tán**: HDFS, Cassandra, MongoDB Replica Set…
- **Content Delivery Network (CDN)**: Akamai, Cloudflare…
- **Điện toán đám mây**: AWS, Azure, GCP…
- **Blockchain & Cryptocurrency**: Bitcoin, Ethereum…
- **Hệ thống IoT**: Quản lý cảm biến, thu thập dữ liệu từ xa…
- **Hệ thống xử lý dữ liệu lớn**: Apache Spark, Flink, Kafka…

---

## 3. Các khái niệm chính của hệ thống phân tán

1. **Scalability**  
   Khả năng mở rộng tài nguyên khi tải hệ thống tăng, bao gồm:
   - **Vertical Scaling** (Scale-up): Nâng cấp phần cứng (CPU, RAM).
   - **Horizontal Scaling** (Scale-out): Thêm nhiều node vào cluster.

2. **Fault Tolerance**  
   Khả năng hệ thống tiếp tục hoạt động khi một hoặc nhiều thành phần bị hỏng.

3. **Availability**  
   Tỷ lệ thời gian hệ thống sẵn sàng phục vụ yêu cầu của người dùng (thường tính theo % uptime).

4. **Transparency**  
   Tính trong suốt với người dùng:
   - **Location Transparency**: Người dùng không biết tài nguyên ở đâu.
   - **Replication Transparency**: Người dùng không biết có bao nhiêu bản sao.
   - **Failure Transparency**: Ẩn toàn bộ lỗi nội bộ.

5. **Concurrency**  
   Khả năng xử lý nhiều yêu cầu (threads, transactions) cùng lúc mà không xung đột.

6. **Parallelism**  
   Phân tán công việc thành các tác vụ nhỏ và thực thi đồng thời trên nhiều CPU/core hoặc nhiều node.

7. **Openness**  
   Khả năng mở rộng, tích hợp dễ dàng với các thành phần mới thông qua chuẩn mở (APIs, protocols).

8. **Load Balancer**  
   Thành phần phân phối lưu lượng (requests) đến nhiều node để tối ưu hiệu suất và độ sẵn sàng.

9. **Replication**  
   Nhân bản dữ liệu hoặc dịch vụ trên nhiều node để tăng **Availability** & **Fault Tolerance**.

---

## 4. Giải thích các thuật ngữ

| Thuật ngữ             | Định nghĩa ngắn gọn                                                                                                                                                 |
|-----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Scalability**       | Mở rộng tài nguyên (phần cứng hoặc node) theo chiều dọc hoặc chiều ngang để đáp ứng tải cao.                                                                       |
| **Vertical Scaling**  | Nâng cấp phần cứng của một node (thêm CPU, RAM…).                                                                                                                   |
| **Horizontal Scaling**| Thêm nhiều node cùng loại vào hệ thống (scale-out).                                                                                                                |
| **Fault Tolerance**   | Hệ thống vẫn hoạt động khi một hay nhiều node gặp sự cố.                                                                                                           |
| **Availability**      | Phần trăm thời gian hệ thống hoạt động và sẵn sàng phục vụ.                                                                                                        |
| **Transparency**      | Ẩn đi các chi tiết phân tán để người dùng hoặc developer không cần quan tâm (địa điểm, số bản sao, lỗi…).                                                          |
| **Concurrency**       | Xử lý đồng thời nhiều yêu cầu hoặc luồng.                                                                                                                           |
| **Parallelism**       | Phân tách công việc và thực thi đồng thời trên nhiều CPU/core hoặc node.                                                                                            |
| **Openness**          | Hỗ trợ mở rộng, tích hợp các thành phần mới thông qua giao thức/chuẩn mở.                                                                                          |
| **Load Balancer**     | Phân phối yêu cầu đến các node backend để tối ưu hiệu suất, cân bằng tải và tăng độ sẵn sàng.                                                                       |
| **Replication**       | Nhân bản dữ liệu hoặc dịch vụ trên nhiều node để tăng khả năng chịu lỗi và tính sẵn sàng.                                                                           |

---

## 5. Ví dụ minh họa

**Ví dụ: Ứng dụng e-commerce (cửa hàng trực tuyến)**

- **Scalability**: Khi có sự kiện giảm giá (Black Friday), hệ thống thêm node web server (Horizontal Scaling) hoặc nâng cấp RAM/CPU (Vertical Scaling) để chịu tải.
- **Load Balancer**: Nginx hoặc AWS ELB phân phối request từ khách hàng đến các web server.
- **Replication**: Cơ sở dữ liệu MySQL chạy trong cluster với nhiều replica để đảm bảo dữ liệu luôn sẵn có và chịu lỗi.
- **Fault Tolerance & Availability**: Khi một node web server bị lỗi, load balancer tự động chuyển request sang node khác; database replica được promote nếu primary hỏng.
- **Concurrency & Parallelism**: Xử lý đồng thời hàng nghìn giao dịch và phân phối các tác vụ xử lý thanh toán, gửi email notification, cập nhật kho hàng song song.
- **Transparency**: Khách hàng không biết mình đang kết nối tới node nào, hay có bao nhiêu bản sao database phía sau.
- **Openness**: Hệ thống mở rộng dễ dàng qua API để tích hợp thêm dịch vụ thanh toán bên thứ ba.

---

## 6. Kiến trúc của hệ thống phân tán

### 6.1. Client-Server
- **Mô hình cơ bản**, client gửi request đến server, server xử lý và trả về kết quả.
- Ví dụ: Web server (Nginx/Apache) + Application server + Database server.

### 6.2. Peer-to-Peer (P2P)
- Mỗi node vừa là client vừa là server, chia sẻ tài nguyên ngang hàng.
- Ví dụ: BitTorrent, blockchain (Bitcoin).

### 6.3. Microservices
- Hệ thống chia nhỏ thành các dịch vụ độc lập, giao tiếp qua API (HTTP/REST, gRPC).
- Tăng tính **Openness**, **Scalability**, **Fault Tolerance**.
- Ví dụ: Netflix, Spotify.

### 6.4. Service Mesh
- Lớp hạ tầng mạng nội bộ giữa các microservice (ví dụ Istio, Linkerd).
- Quản lý **load balancing**, **security**, **observability** một cách tập trung.

### 6.5. Serverless / FaaS
- Triển khai code dưới dạng hàm nhỏ, tự động scale theo nhu cầu.
- Ví dụ: AWS Lambda, Google Cloud Functions.

### 6.6. Edge Computing
- Đưa tính toán và lưu trữ xuống gần người dùng cuối để giảm độ trễ.
- Ví dụ: CDN với edge functions (Cloudflare Workers).

---

## 7. Tài liệu tham khảo

1. Tanenbaum, A. S., & Van Steen, M. (2016). *Distributed Systems: Principles and Paradigms*.  
2. Coulouris, G., Dollimore, J., Kindberg, T., & Blair, G. (2011). *Distributed Systems: Concepts and Design*.  
3. Slide “Distributed Systems Architectures” – Google search “modern distributed system architecture models”  
4. AWS Architecture Center – Microservices & Serverless Patterns  
5. Martin Fowler – Microservices and Service Mesh  

---

# Gunakan image Go sebagai base
FROM golang:1.20

# Set environment variable agar binari Go tidak statis
ENV CGO_ENABLED=0 \
    GOOS=linux \
    GO111MODULE=on

# Set working directory di dalam container
WORKDIR /app

# Salin go.mod dan go.sum terlebih dahulu
COPY go.mod go.sum ./

# Unduh dependency awal (agar layer ini cacheable)
RUN go mod download

# Salin seluruh project ke dalam container
COPY . .

# Build aplikasi Go
RUN go build -o main .

# Buka port (jika kamu pakai port 8080 misalnya)
EXPOSE 8080

# Jalankan binary
CMD ["./main"]
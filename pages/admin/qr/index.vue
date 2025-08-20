<template>
    <div class="qr-page">
        <div class="qr-card">
            <img src="@/assets/qr-sample.png" alt="QR Code" class="qr-image" />
        </div>
    </div>
</template>

<script>
export default {
    name: "QrCodePage",
};
</script>

<style scoped>
.qr-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    min-height: calc(100vh - 64px);
    /* kalau ada header */
    background: linear-gradient(135deg, #1E51E0, #3b6ef5);
}

.qr-card {
    background: white;
    padding: 20px;
    border-radius: 16px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
}

.qr-image {
    max-width: 400px;
    width: 100%;
    height: auto;
    border-radius: 12px;
}
</style>
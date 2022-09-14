<template>
  <div ref="qrCodeContainer" class="qrcode-container">
    <div ref="qrCode" class="qrcode"></div>
  </div>
</template>

<script>
import QRCodeStyling from "qr-code-styling";

export default {
  name: "QrCode",
  props: ["url"],
  mounted() {
    this.generateQrcode();
  },
  methods: {
    generateQrcode() {
      const qrCode = new QRCodeStyling({
        width: this.$refs.qrCodeContainer.clientWidth,
        height: this.$refs.qrCodeContainer.clientHeight,
        type: "svg",
        data: this.url,
        image: '',
        dotsOptions: {
          color: "#000",
          type: "classy"
        },
        backgroundOptions: {
          color: "#FFF",
        },
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 20
        },
        cornersSquareOptions: {
          type: "rounded"
        }
      });

      let qc = this.$refs.qrCode;
      qrCode.append(qc);
    }
  }
}
</script>

<style scoped>
.qrcode-container {
  width: 90%;
  height: 90%;
  border-radius: 5px;
  overflow: hidden;
}

.qrcode {
}

</style>
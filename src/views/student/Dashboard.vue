<script setup>
import { ref, onMounted, computed } from "vue";
import Api from "../../api/axios";
import Swal from "sweetalert2";

// Import semua komponen anak
import DashboardHeader from "./components/DashboardHeader.vue";
import BillCard from "./components/BillCard.vue";
import TransactionHistory from "./components/TransactionHistory.vue";
import HelpCard from "./components/HelpCard.vue";
import ArchivedBills from "./components/ArchivedBills.vue";

const bills = ref([]);
const isLoading = ref(true);

const userStr = localStorage.getItem("user");
const studentData = userStr ? JSON.parse(userStr) : {};

const activeBills = computed(() => bills.value.filter((b) => b.status !== "paid"));
const historyBills = computed(() => bills.value.filter((b) => b.status === "paid"));

const paymentHistory = computed(() => {
  let history = [];
  bills.value.forEach((bill) => {
    if (bill.transactions && bill.transactions.length > 0) {
      const successfulTrx = bill.transactions.filter((trx) => trx.status === "success");
      successfulTrx.forEach((trx) => {
        history.push({
          id: trx.id,
          title: `Pembayaran SPP ${bill.month} ${bill.year}`,
          amount: trx.amount,
          date: new Date(trx.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          rawDate: new Date(trx.created_at),
        });
      });
    }
  });
  return history.sort((a, b) => b.rawDate - a.rawDate);
});

const totalTunggakan = computed(() => {
  return activeBills.value.reduce(
    (total, bill) => total + (bill.amount - bill.paid_amount),
    0
  );
});

const fetchMyBills = async () => {
  isLoading.value = true;
  try {
    const response = await Api.get("/student/my-bills");
    bills.value = response.data.data;
  } catch (error) {
    Swal.fire("Gagal", "Tidak dapat memuat data tagihan.", "error");
  } finally {
    isLoading.value = false;
  }
};

const formatRupiah = (angka) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
};

// --- LOGIKA MIDTRANS ---
const processPayment = async (billId, amountToPay) => {
  try {
    Swal.fire({
      title: "Memproses...",
      text: "Menghubungkan ke payment gateway",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    const response = await Api.post("/student/pay", {
      bill_id: billId,
      amount: amountToPay,
    });
    const snapToken = response.data.snap_token;
    Swal.close();

    if (window.snap) {
      window.snap.pay(snapToken, {
        onSuccess: function () {
          Swal.fire("Berhasil!", "Pembayaran berhasil dicatat!", "success");
          fetchMyBills();
        },
        onPending: function () {
          Swal.fire("Pending", "Selesaikan instruksi pembayaran.", "info");
          fetchMyBills();
        },
        onError: function () {
          Swal.fire("Gagal", "Pembayaran gagal.", "error");
        },
      });
    } else {
      Swal.fire("Error", "Midtrans belum siap. Refresh halaman.", "error");
    }
  } catch (error) {
    Swal.fire(
      "Gagal",
      error.response?.data?.message || "Gagal memproses pembayaran.",
      "error"
    );
  }
};

const handlePayFull = (bill) => processPayment(bill.id, bill.amount - bill.paid_amount);

const handlePayPartial = async (bill) => {
  const sisa = bill.amount - bill.paid_amount;
  const { value: nominal } = await Swal.fire({
    title: "Nominal Cicilan",
    input: "number",
    inputLabel: `Sisa Tagihan: ${formatRupiah(sisa)}`,
    showCancelButton: true,
    confirmButtonText: "Lanjut Bayar",
    inputValidator: (value) => {
      if (!value || value < 10000) return "Minimal cicilan Rp 10.000!";
      if (value > sisa) return "Nominal melebihi sisa tagihan!";
    },
  });
  if (nominal) processPayment(bill.id, parseInt(nominal));
};

onMounted(() => fetchMyBills());
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-6">
    <DashboardHeader
      :student-data="studentData"
      :bills="bills"
      :total-tunggakan="totalTunggakan"
    />

    <div v-if="isLoading" class="text-center py-12">
      <p class="text-gray-500 font-medium animate-pulse">Memuat data sistem...</p>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-5">
        <h3 class="font-bold text-gray-800 text-xl border-l-4 border-indigo-500 pl-3">
          Tagihan Aktif
        </h3>

        <div
          v-if="activeBills.length === 0"
          class="bg-green-50 border border-green-200 text-green-700 p-6 rounded-2xl flex items-center gap-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-10 w-10 text-green-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
          <div>
            <h3 class="font-bold">Alhamdulillah!</h3>
            <p>Semua kewajiban administrasi ananda telah lunas.</p>
          </div>
        </div>

        <BillCard
          v-for="bill in activeBills"
          :key="bill.id"
          :bill="bill"
          @pay-full="handlePayFull"
          @pay-partial="handlePayPartial"
        />

        <ArchivedBills :history-bills="historyBills" />
      </div>

      <div class="lg:col-span-1">
        <TransactionHistory :payment-history="paymentHistory" />
        <HelpCard />
      </div>
    </div>
  </div>
</template>

function confirmDelete() {
    if (confirm("Apakah Anda yakin ingin menghapus foto profil?")) {
        document.getElementById("confirm-delete").submit();
    }
}
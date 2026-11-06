# Silva's Little Wonderland

Website birthday interaktif vanilla HTML/CSS/JavaScript. Tidak memerlukan build step atau backend.

## Menjalankan secara lokal

Dari folder ini:

```bash
python3 -m http.server 4173
```

Kemudian buka `http://localhost:4173`.

## Kandungan utama

- Welcome scene, intro editor, progress map, unlock flow dan localStorage.
- Bubble Shooter dengan aim touch/mouse, garis trajectory bertitik, wall bounce, swap, cluster match, drop bubble dan 3 helper.
- Memory Match dengan Easy / Normal / Hard.
- Maze Escape dengan key, exit, bonus stars, keyboard dan D-pad.
- Mystery Garden dengan 5 surprise boxes.
- Letter Cottage dengan 4 surat editable.
- Memory Gallery dengan 10 slot upload foto, caption edit, replace, delete/clear dan lightbox.
- Gift Castle dengan 3 gift room yang unlock Secret Room.
- Secret Room yang tidak memperlihatkan mesej sebelum kotak dibuka.
- Birthday Celebration dengan Make a Wish dan final letter.
- Music panel untuk upload / replace / remove MP3 sendiri, play/pause, volume, mute dan autoplay fallback.
- Inline chibi character asset konsisten di semua lokasi, berasaskan ciri penguin rujukan: body biru-putih, topi kuning, goggles oren, paruh dan kaki oren.

## Nota kandungan & media

Semua ucapan adalah placeholder pendek yang boleh diganti. Teks, progress, caption dan media yang dimasukkan pengguna disimpan melalui `localStorage` pada peranti/browser yang sama. Muzik tidak mempunyai lagu contoh: gunakan `Music → Upload / Replace Music` untuk memilih MP3 sendiri. Untuk perkongsian umum, host folder ini di mana-mana static hosting dan gunakan asset audio yang diterbitkan bersama website; upload melalui browser hanya menyimpan lagu pada peranti itu.

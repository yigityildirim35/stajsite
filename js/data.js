/* Oyunlarda kullanılan bilgisayar parçaları.
   type: 'ic' = kasanın içindeki donanım, 'giris' = giriş birimi, 'cikis' = çıkış birimi
   role: parçanın görevi (5. sınıf seviyesinde kısa cümle)
   fact: "Biliyor muydun?" bilgisi
   hint: Bilgisayarı Topla oyununda nereye takıldığına dair ipucu */
const PARTS = [
  {
    id: 'cpu', name: 'İşlemci (CPU)', type: 'ic',
    role: 'Bilgisayarın beynidir. Bütün hesaplamaları o yapar.',
    fact: 'İşlemci bir saniyede milyarlarca işlem yapabilir!',
    hint: 'İşlemci kare şeklindedir. Anakartın üstündeki kare yuvaya takılır.'
  },
  {
    id: 'ram', name: 'RAM (Bellek)', type: 'ic',
    role: 'Bilgisayarın kısa süreli hafızasıdır. O an açık olan programları tutar.',
    fact: 'Bilgisayar kapanınca RAM\'deki bilgiler silinir.',
    hint: 'RAM uzun ve incedir. Anakarttaki uzun ince yuvalara takılır.'
  },
  {
    id: 'ssd', name: 'SSD (Depolama)', type: 'ic',
    role: 'Fotoğrafları, oyunları ve dosyaları saklar.',
    fact: 'SSD\'deki bilgiler bilgisayar kapansa da silinmez.',
    hint: 'Depolama birimi kasanın alt kısmındaki sağ yuvaya yerleşir.'
  },
  {
    id: 'gpu', name: 'Ekran Kartı', type: 'ic',
    role: 'Ekranda gördüğümüz resimleri ve görüntüleri hazırlar.',
    fact: 'Oyunlardaki renkli ve hareketli görüntüleri ekran kartı çizer.',
    hint: 'Ekran kartı büyük ve uzundur. Anakartın altındaki uzun yatay yuvaya takılır.'
  },
  {
    id: 'psu', name: 'Güç Kaynağı', type: 'ic',
    role: 'Prizden gelen elektriği bilgisayarın bütün parçalarına dağıtır.',
    fact: 'Güç kaynağı olmadan hiçbir parça çalışamaz.',
    hint: 'Güç kaynağı ağır bir kutudur. Kasanın en altına, sol tarafa yerleşir.'
  },
  {
    id: 'fan', name: 'Fan', type: 'ic',
    role: 'Bilgisayarın içini serinletir, parçaların fazla ısınmasını önler.',
    fact: 'Parçalar çalışırken ısınır. Fan bu sıcak havayı dışarı atar.',
    hint: 'Fan yuvarlak pervanesiyle kasanın arka tarafındaki yuvarlak deliğe takılır.'
  },
  {
    id: 'motherboard', name: 'Anakart', type: 'ic',
    role: 'Bütün parçaların takıldığı büyük devre kartıdır. Parçaları birbirine bağlar.',
    fact: 'Anakart, parçaların birbiriyle "konuşmasını" sağlar.'
  },
  {
    id: 'case', name: 'Kasa', type: 'ic',
    role: 'Bilgisayarın parçalarını içinde taşıyan ve koruyan kutudur.',
    fact: 'Kasa, parçaları tozdan ve darbelerden korur.'
  },
  {
    id: 'keyboard', name: 'Klavye', type: 'giris',
    role: 'Bilgisayara harf ve rakam yazmamızı sağlar.',
    fact: 'Türkiye\'de Q ve F olmak üzere iki çeşit klavye kullanılır.'
  },
  {
    id: 'mouse', name: 'Fare', type: 'giris',
    role: 'Ekrandaki oku hareket ettirip tıklamamızı sağlar.',
    fact: 'İlk bilgisayar faresi tahtadan yapılmıştı!'
  },
  {
    id: 'microphone', name: 'Mikrofon', type: 'giris',
    role: 'Sesimizi bilgisayara gönderir.',
    fact: 'Sesli mesaj gönderirken mikrofon kullanırız.'
  },
  {
    id: 'webcam', name: 'Kamera', type: 'giris',
    role: 'Görüntümüzü bilgisayara gönderir.',
    fact: 'Görüntülü konuşmalarda kamera kullanırız.'
  },
  {
    id: 'scanner', name: 'Tarayıcı', type: 'giris',
    role: 'Kâğıttaki yazı ve resimleri bilgisayara aktarır.',
    fact: 'Tarayıcı, kâğıdın fotoğrafını çeker gibi çalışır.'
  },
  {
    id: 'monitor', name: 'Monitör', type: 'cikis',
    role: 'Bilgisayardaki görüntüleri bize gösterir.',
    fact: 'Monitör ekranı piksel denen milyonlarca küçük noktadan oluşur.'
  },
  {
    id: 'speaker', name: 'Hoparlör', type: 'cikis',
    role: 'Bilgisayardaki sesleri duymamızı sağlar.',
    fact: 'Hoparlörün içindeki ince zar titreşerek ses çıkarır.'
  },
  {
    id: 'printer', name: 'Yazıcı', type: 'cikis',
    role: 'Bilgisayardaki yazı ve resimleri kâğıda basar.',
    fact: 'Renkli yazıcılar birkaç mürekkebi karıştırarak her rengi elde eder.'
  },
  {
    id: 'headphones', name: 'Kulaklık', type: 'cikis',
    role: 'Bilgisayardaki sesleri sadece bizim duymamızı sağlar.',
    fact: 'Kulaklıkla çok yüksek sesle dinlemek kulaklarımıza zarar verir.'
  },
  {
    id: 'projector', name: 'Projeksiyon', type: 'cikis',
    role: 'Bilgisayardaki görüntüyü duvara ya da perdeye yansıtır.',
    fact: 'Sınıflarda sunum yaparken projeksiyon kullanılır.'
  }
];

const PART = {};
PARTS.forEach(function (p) { PART[p.id] = p; });

const TYPE_NAMES = { ic: 'iç donanım', giris: 'giriş birimi', cikis: 'çıkış birimi' };

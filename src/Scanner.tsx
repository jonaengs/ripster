import { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';

const QrCodeReader = ({ onRead }: { onRead: (data: string) => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanner, setScanner] = useState<QrScanner | null>(null);
  // Can't believe I actually have to track this state, but I can't find any apis for checking whether this is the case (i didn't look very hard though)
  const [isScanning, setIsScanning] = useState(false);

  function stopScanner() {
    if (scanner !== null) {
      scanner.stop();
      setIsScanning(false);
    }
  }

  function startScanner() {
    if (scanner !== null) {
      scanner.start();
      setIsScanning(true);
    }
  }

  function teardownScanner() {
    if (scanner !== null) {
      scanner.destroy();
      setScanner(null);
    }
  }

  function onResult(result: QrScanner.ScanResult) {
    // TODO: Check if result is valid before this (maybe have component accept a validation function)
    stopScanner();
    teardownScanner();
    onRead(result.data);
  }

  useEffect(() => {
    if (videoRef.current && !scanner) {
      const qrScanner = new QrScanner(
        videoRef.current,
        onResult,
        {
          returnDetailedScanResult: true,
          highlightCodeOutline: false,
          // TODO: Maybe do some error reporting here
          onDecodeError: undefined,
        }
      );
      setScanner(qrScanner);
      return () => qrScanner.destroy();
    }
  }, [videoRef])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'black',
      }}
    >
      {
        !isScanning &&
        // iphone doesn't allow auto-starting the scanner, so we need to have users press this button first
        <button onClick={startScanner}
          style={{
            width: '100svw',
            height: '100svh',
            fontSize: '3rem',
            fontWeight: 'bold',
            backgroundColor: 'inherit',
            color: "#88dd99"
          }}
        >
          CLICK
          <br />
          TO
          <br />
          START
          <br />
          SCANNING
        </button>
      }

      <video ref={videoRef} style={{
        width: '100svw',
        height: '100svh',
      }} />

    </div>
  );
};

function Link({ link, onClick }: { link: string, onClick: () => void }) {
  const [countDown, setCountDown] = useState(3);
  useEffect(() => {
    if (countDown > 0) {
      setTimeout(() => {
        setCountDown(countDown - 1);
      }, 1000)
    }
  }, [countDown])

  const colors = [
    "#ff5bd7",
    "#ffe33d",
    "#ef0041",
    "#a4debf",
    "#008080",
  ]

  return <a href={countDown > 0 ? undefined : link}
    onClick={countDown > 0 ? undefined : onClick}
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      fontSize: '8rem',
      backgroundColor: colors[countDown % colors.length],
      color: colors[(countDown + 1) % colors.length],
      textAlign: 'center',
    }}
  >
    {countDown > 0 ? countDown : "Click Me!"}
  </a>
}


export function Scanner() {
  const [link, setLink] = useState<string | null>(null);
  return (
    <>
      {link === null ?
        <QrCodeReader onRead={setLink} />
        :
        <Link link={link} onClick={() => setLink(null)} />
      }
    </>
  )
}

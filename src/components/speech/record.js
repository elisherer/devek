function getAllSupportedMimeTypes(...mediaTypes) {
  if (!mediaTypes.length) mediaTypes.push("video", "audio");
  const CONTAINERS = [
    "webm",
    "ogg",
    "mp3",
    "mp4",
    "x-matroska",
    "3gpp",
    "3gpp2",
    "3gp2",
    "quicktime",
    "mpeg",
    "aac",
    "flac",
    "x-flac",
    "wave",
    "wav",
    "x-wav",
    "x-pn-wav",
    "not-supported"
  ];
  const CODECS = [
    "vp9",
    "vp9.0",
    "vp8",
    "vp8.0",
    "avc1",
    "av1",
    "h265",
    "h.265",
    "h264",
    "h.264",
    "opus",
    "vorbis",
    "pcm",
    "aac",
    "mpeg",
    "mp4a",
    "rtx",
    "red",
    "ulpfec",
    "g722",
    "pcmu",
    "pcma",
    "cn",
    "telephone-event",
    "not-supported"
  ];

  return [
    ...new Set(CONTAINERS.flatMap(ext => mediaTypes.flatMap(mediaType => [`${mediaType}/${ext}`]))),
    ...new Set(
      CONTAINERS.flatMap(ext =>
        CODECS.flatMap(codec =>
          mediaTypes.flatMap(mediaType => [
            // NOTE: 'codecs:' will always be true (false positive)
            `${mediaType}/${ext};codecs=${codec}`
          ])
        )
      )
    ),
    ...new Set(
      CONTAINERS.flatMap(ext =>
        CODECS.flatMap(codec1 =>
          CODECS.flatMap(codec2 =>
            mediaTypes.flatMap(mediaType => [`${mediaType}/${ext};codecs="${codec1}, ${codec2}"`])
          )
        )
      )
    )
  ].filter(variation => MediaRecorder.isTypeSupported(variation));
}

export const supportedVideos = getAllSupportedMimeTypes("video");
export const supportedAudios = getAllSupportedMimeTypes("audio");

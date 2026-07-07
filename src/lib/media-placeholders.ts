export const MEMBER_PLACEHOLDER_IMAGE = "/images/placeholders/member.png";

const supabaseImageHost = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    return null;
  }

  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
})();

function escapeCssUrl(value: string) {
  return value.replace(/"/g, "%22");
}

function isAllowedRemoteImage(value: string) {
  if (!supabaseImageHost) {
    return false;
  }

  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname === supabaseImageHost &&
      url.pathname.startsWith("/storage/v1/object/public/smashtime-media/")
    );
  } catch {
    return false;
  }
}

export function getMemberImageSrc(src?: string | null) {
  const value = src?.trim();
  if (!value) {
    return MEMBER_PLACEHOLDER_IMAGE;
  }

  if (value.startsWith("/images/") || isAllowedRemoteImage(value)) {
    return value;
  }

  return MEMBER_PLACEHOLDER_IMAGE;
}

export function getMemberBackgroundStyle(src?: string | null) {
  const value = getMemberImageSrc(src);

  if (value.startsWith("/")) {
    return { backgroundImage: `url("${escapeCssUrl(value)}")` };
  }

  try {
    const url = new URL(value);
    if (url.protocol === "https:") {
      return { backgroundImage: `url("${escapeCssUrl(url.href)}")` };
    }
  } catch {
    // Fall through to the local placeholder below.
  }

  return { backgroundImage: `url("${MEMBER_PLACEHOLDER_IMAGE}")` };
}

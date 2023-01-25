import bcrypt from "bcrypt";

const hasIpVoted = async (ipAddress: string, listOfIps: string[]) => {
  const ips = Array.isArray(listOfIps) ? listOfIps : [];
  for (const ip of ips) {
    if (await bcrypt.compare(ipAddress, ip)) {
      return true;
    }
  }
  return false;
}

export { hasIpVoted }

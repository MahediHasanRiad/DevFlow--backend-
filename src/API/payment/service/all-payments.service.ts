import { prisma } from "../../../lib/prisma.js";

interface AllReleasedPaymentsType {
  page?: number;
  limit?: number;
  sortType?: string;
  sortBy?: "asc" | "desc";
  search?: string;
}

export const AllReleasedPayments = async ({
  search = "",
  sortType = "status",
  sortBy = "desc",
  page = 1,
  limit = 10,
}: AllReleasedPaymentsType) => {
  try {
    const skip = (Math.max(1, page) - 1) * limit;
    const paymentRelease = await prisma.payment.findMany({
      where: {
        status: "RELEASED",
        job: {
          user: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      },
      include: {
        job: {
          include: {
            user: true,
          },
        },
      },

      orderBy: {
        [sortType]: sortBy,
      },
      skip: skip,
      take: limit,
    });

    return paymentRelease;
  } 
  catch (error) {
    console.error(error);
  }
};

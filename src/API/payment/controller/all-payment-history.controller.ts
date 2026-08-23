import redis from "../../../config/redis.js";
import { prisma } from "../../../lib/prisma.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { Pagination } from "../../../shared/pagination.js";
import type { QueryType } from "../../../types/type.js";
import { AllReleasedPayments } from "../service/all-payments.service.js";

export const AllPaymentHistoryController = asyncHandler(async (req, res) => {
  let {
    page = 1,
    limit = 10,
    sortBy = "desc",
    sortType = "status",
    search = "",
  } = req.query as QueryType;

  page = Number(page);
  limit = Number(limit);

  // find from redis
  const hashKey = `payment-history:admin`;
  const field = `page:${page}:limit:${limit}:sortBy:${sortBy || ""}:sortType:${sortType || ""}:search:${search || ""}`;
  const tasks = await redis.hGet(hashKey, field);

  if (tasks) {
    res.status(200).json(new apiResponse(JSON.parse(tasks), "success"));
  } else {
    // list of all payment that release
    const payments = await AllReleasedPayments({
      page,
      limit,
      sortBy,
      sortType,
      search,
    });
    const totalItems = await prisma.payment.count({
      where: {
        status: 'RELEASED',
        job: {
          user: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      },
    });

    const pagination = Pagination(page, limit, totalItems, '/user/all-payment-history')

    // set in redis
    await redis.hSet(hashKey, field, JSON.stringify({payments, pagination}))

    res.status(200).json(new apiResponse({payments, pagination}, 'success'))
  }
});

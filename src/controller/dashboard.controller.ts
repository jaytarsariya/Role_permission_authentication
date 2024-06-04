import { RequestHandler } from 'express';
import { Ok, BadRequest } from '../helper/error-handle';
import { Order } from '../models/order.model';
import { ObjectId } from 'mongodb';
import { User } from '../models/user.model';

export const dailyOrder: RequestHandler = async (request, response) => {
  try {
    let today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    let pipeline = [
      {
        $match: {
          userId: new ObjectId(request.udata.id),
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          orders: { $push: '$$ROOT' }, //root means all data
        },
      },
    ];

    const result = await Order.aggregate(pipeline).exec();
    const data = result.length > 0 ? result[0].orders : [];
    const count = result.length > 0 ? result[0].count : 0;

    return Ok(response, 'order fetched successfully', { count, data });
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};


// export const getUserByCriteria:RequestHandler = async(request,response)=>{
//   try {
//     let body = request.body

//     const data = await User.findOne({_id:body.userId},{proje})
//     return Ok(response,'data fetched successfully',data)
//   } catch (error:any) {
//     return BadRequest(response,{message:error.message})
//   }
// }
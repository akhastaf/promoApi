import { ArgumentMetadata, ForbiddenException, Injectable, PipeTransform } from "@nestjs/common";
import { Request } from "express";
import { join } from "path";
import * as sharp from "sharp";
import { v4 as uuidv4} from "uuid";

@Injectable()
export class SharpPipe implements PipeTransform<Express.Multer.File, Promise<String>> {
    async transform(image: Express.Multer.File): Promise<String> {
        if (image.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
            const filename = '/public/' + uuidv4() + '.webp';
            await sharp(image.buffer)
                .resize(800)
                .webp({effort: 3})
                .toFile(join(__dirname, `../../../client${filename}`));
            return `public/${uuidv4()}.webp`;
        }
        throw new ForbiddenException('Only image files are allowed!');
    }
}
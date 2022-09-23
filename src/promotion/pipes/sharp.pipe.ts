import { ArgumentMetadata, ForbiddenException, Injectable, PipeTransform } from "@nestjs/common";
import { Request } from "express";
import { join } from "path";
import * as sharp from "sharp";
import { v4 as uuidv4} from "uuid";

@Injectable()
export class SharpPipe implements PipeTransform<Express.Multer.File, Promise<String>> {
    async transform(image: Express.Multer.File): Promise<String> {
        if (!image.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            const filename = 'client/public/' + uuidv4() + '.webp';
            await sharp(image.buffer)
                .resize(800)
                .webp({effort: 3})
                .toFile(join(__dirname, `../../../${filename}`));
            return filename;
        }
        throw new ForbiddenException('Only image files are allowed!');
    }
}
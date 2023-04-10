import { Module } from '@nestjs/common';
import { MediaService } from './services/MediaService';
import { HttpModule } from '@nestjs/axios';
import { FileService } from './services';

@Module({
  imports: [HttpModule],
  providers: [MediaService, FileService],
  exports: [MediaService, FileService],
})
export class MediaModule {}

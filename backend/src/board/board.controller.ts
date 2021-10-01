import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Board, User } from '@prisma/client';
import { RequestUser } from 'src/auth/auth.service';
import { BoardService } from './board.service';

@Controller('board')
@ApiTags('board')
@UseGuards(AuthGuard())
@ApiBearerAuth() 
export class BoardController {
    constructor(private readonly boardService: BoardService) {}

    @Post()
    @ApiOperation({ summary: 'Creates and returns a new board' })
    @ApiParam({ name: 'title' })
    public async createBoard(@RequestUser() user: User, @Body() board: Board): Promise<Board>{
        return this.boardService.create(user, board);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Returns a board by specific ID' })
    public async getBoard(@RequestUser() user: User, @Param('id') id: number): Promise<Board> {
        
        const result = await this.boardService.find(user, Number(id));
        if (!result){
            throw new HttpException("Invalid board id", HttpStatus.NOT_FOUND);
        }
        return result
        
    }
}

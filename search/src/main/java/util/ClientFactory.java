package util;

import org.elasticsearch.client.Client;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.transport.client.PreBuiltTransportClient;

import java.net.InetAddress;

/**
 * Created by tommenx on 2018/3/18.
 */
public class ClientFactory {
    private static String host="127.0.0.1"; // 服务器地址
    private static int port=9300; // 端口
    public static Client transportClient() throws Exception{
        TransportClient client = new PreBuiltTransportClient(Settings.EMPTY)
                .addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName(host), port));
        System.out.println(client);
        return client;
    }
}
